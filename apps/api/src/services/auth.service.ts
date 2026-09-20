import crypto from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/notify.js';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../schemas/auth.js';
import type { SafeUser } from '@ai-esa/shared';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class AuthService {
  /**
   * Registers a new user. Generates verification token, saves user as unverified,
   * and sends verification email.
   */
  async register(input: RegisterInput): Promise<{ user: SafeUser; message: string }> {
    const normalizedEmail = input.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db
      .select({ id: users.id, isVerified: users.isVerified })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      const err = new Error('An account with this email already exists') as Error & { statusCode: number };
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(input.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const [newUser] = await db
      .insert(users)
      .values({
        name: input.name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        isActive: true,
        isVerified: false,
        verificationToken,
        verificationTokenExpiresAt,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    // Send verification email (non-blocking so network latency/timeouts never slow down the API)
    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    console.log(`\n======================================================`);
    console.log(`📨 [AUTH] Verification link for ${newUser.email}:`);
    console.log(`🔗 ${verificationLink}`);
    console.log(`======================================================\n`);

    sendVerificationEmail(newUser.name, newUser.email, verificationLink).catch((e) => {
      console.error('[auth] Failed to send verification email on registration:', e?.message || e);
    });

    return {
      user: newUser,
      message: 'Registration successful. Please check your email to verify your account before logging in.',
    };
  }

  /**
   * Verifies user email by token.
   */
  async verifyEmail(input: VerifyEmailInput): Promise<{ message: string }> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, input.token))
      .limit(1);

    if (!user) {
      const err = new Error('Invalid or expired verification link.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    if (user.verificationTokenExpiresAt && new Date(user.verificationTokenExpiresAt) < new Date()) {
      const err = new Error('Verification link has expired. Please request a new one.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, user.id));

    return { message: 'Email verified successfully! You can now log in.' };
  }

  /**
   * Resends verification email.
   */
  async resendVerification(input: ResendVerificationInput): Promise<{ message: string }> {
    const normalizedEmail = input.email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      // Don't leak existence
      return { message: 'If an account exists with this email, a verification link has been sent.' };
    }

    if (user.isVerified) {
      const err = new Error('This account has already been verified. You can log in directly.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db
      .update(users)
      .set({
        verificationToken,
        verificationTokenExpiresAt,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, user.id));

    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    console.log(`\n======================================================`);
    console.log(`📨 [AUTH] Resent verification link for ${user.email}:`);
    console.log(`🔗 ${verificationLink}`);
    console.log(`======================================================\n`);

    sendVerificationEmail(user.name, user.email, verificationLink).catch((e) => {
      console.error('[auth] Failed to resend verification email:', e?.message || e);
    });

    return { message: 'A fresh verification link has been sent to your email address.' };
  }

  /**
   * Initiates forgot password flow.
   */
  async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const normalizedEmail = input.email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await db
        .update(users)
        .set({
          resetPasswordToken: resetToken,
          resetPasswordTokenExpiresAt: resetTokenExpiresAt,
          updatedAt: sql`(datetime('now'))`,
        })
        .where(eq(users.id, user.id));

      const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
      console.log(`\n======================================================`);
      console.log(`🔑 [AUTH] Password reset link for ${user.email}:`);
      console.log(`🔗 ${resetLink}`);
      console.log(`======================================================\n`);

      sendPasswordResetEmail(user.name, user.email, resetLink).catch((e) => {
        console.error('[auth] Failed to send password reset email:', e?.message || e);
      });
    }

    return { message: 'If an account exists with this email, a password reset link has been sent.' };
  }

  /**
   * Resets password using reset token.
   */
  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, input.token))
      .limit(1);

    if (!user) {
      const err = new Error('Invalid or expired password reset link.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    if (user.resetPasswordTokenExpiresAt && new Date(user.resetPasswordTokenExpiresAt) < new Date()) {
      const err = new Error('Password reset link has expired. Please request a new one.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    const newPasswordHash = await hashPassword(input.password);

    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, user.id));

    return { message: 'Password has been reset successfully. You can now log in with your new password.' };
  }

  /**
   * Authenticates user by email and password.
   * Throws 401 if credentials are invalid.
   * Throws 403 if email is not verified.
   */
  async login(input: LoginInput): Promise<SafeUser> {
    const normalizedEmail = input.email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      const err = new Error('Invalid email or password') as Error & { statusCode: number };
      err.statusCode = 401;
      throw err;
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      const err = new Error('Invalid email or password') as Error & { statusCode: number };
      err.statusCode = 401;
      throw err;
    }

    // Check if account is active
    if (!user.isActive) {
      const err = new Error('Your account has been deactivated. Please contact support.') as Error & { statusCode: number };
      err.statusCode = 403;
      throw err;
    }

    // Require email verification before allowing login
    if (!user.isVerified) {
      const err = new Error('Please verify your email address before logging in. A verification link was sent to your email.') as Error & { statusCode: number; emailNotVerified?: boolean; email?: string };
      err.statusCode = 403;
      err.emailNotVerified = true;
      err.email = user.email;
      throw err;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Gets a user by ID.
   */
  async getUserById(id: number): Promise<SafeUser | null> {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  /**
   * Updates authenticated user's profile information (name).
   */
  async updateProfile(userId: number, input: UpdateProfileInput): Promise<SafeUser> {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: input.name.trim(),
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      const err = new Error('User not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }

    return updatedUser;
  }

  /**
   * Changes authenticated user's password after verifying current password.
   */
  async changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
    const [user] = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      const err = new Error('User not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }

    const isValid = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!isValid) {
      const err = new Error('The current password is incorrect') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, userId));
  }
}

export const authService = new AuthService();
