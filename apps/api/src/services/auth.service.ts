import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.js';
import type { SafeUser } from '@ai-esa/shared';

export class AuthService {
  /**
   * Registers a new user. Throws error if email already exists.
   */
  async register(input: RegisterInput): Promise<SafeUser> {
    const normalizedEmail = input.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      const err = new Error('An account with this email already exists') as Error & { statusCode: number };
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(input.password);

    const [newUser] = await db
      .insert(users)
      .values({
        name: input.name.trim(),
        email: normalizedEmail,
        passwordHash,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return newUser;
  }

  /**
   * Authenticates user by email and password.
   * Throws 401 if credentials are invalid (without revealing which).
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
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
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }
}

export const authService = new AuthService();
