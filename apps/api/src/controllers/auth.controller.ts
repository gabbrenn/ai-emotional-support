import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.js';
import { authService } from '../services/auth.service.js';

export class AuthController {
  /**
   * POST /api/auth/register
   * Registers user and requires email verification.
   */
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = registerSchema.parse(request.body);
      const result = await authService.register(validatedInput);

      return reply.status(201).send({
        user: result.user,
        message: result.message,
      });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'An error occurred during registration',
        statusCode,
      });
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = loginSchema.parse(request.body);
      const user = await authService.login(validatedInput);

      const token = request.server.jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        { expiresIn: '7d' },
      );

      return reply.status(200).send({ user, token });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      const customErr = err as { statusCode?: number; message?: string; emailNotVerified?: boolean; email?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'An error occurred during login',
        emailNotVerified: customErr.emailNotVerified,
        email: customErr.email,
        statusCode,
      });
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = verifyEmailSchema.parse(request.body);
      const result = await authService.verifyEmail(validatedInput);
      return reply.status(200).send(result);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'Failed to verify email',
        statusCode,
      });
    }
  }

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = resendVerificationSchema.parse(request.body);
      const result = await authService.resendVerification(validatedInput);
      return reply.status(200).send(result);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'Failed to resend verification email',
        statusCode,
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = forgotPasswordSchema.parse(request.body);
      const result = await authService.forgotPassword(validatedInput);
      return reply.status(200).send(result);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'Failed to process request',
        statusCode,
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = resetPasswordSchema.parse(request.body);
      const result = await authService.resetPassword(validatedInput);
      return reply.status(200).send(result);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'Failed to reset password',
        statusCode,
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const payload = request.user;
      const user = await authService.getUserById(payload.id);

      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          statusCode: 404,
        });
      }

      return reply.status(200).send({ user });
    } catch {
      return reply.status(500).send({
        error: 'Failed to retrieve user profile',
        statusCode: 500,
      });
    }
  }

  /**
   * PATCH /api/auth/me
   */
  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = updateProfileSchema.parse(request.body);
      const user = await authService.updateProfile(request.user.id, validatedInput);

      return reply.status(200).send({ user });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'An error occurred while updating profile',
        statusCode,
      });
    }
  }

  /**
   * PATCH /api/auth/password
   */
  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = changePasswordSchema.parse(request.body);
      await authService.changePassword(request.user.id, validatedInput);

      return reply.status(200).send({ message: 'Your password has been changed successfully.' });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'An error occurred while changing password',
        statusCode,
      });
    }
  }
}

export const authController = new AuthController();
