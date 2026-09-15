import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth.js';
import { authService } from '../services/auth.service.js';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedInput = registerSchema.parse(request.body);
      const user = await authService.register(validatedInput);

      const token = request.server.jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        { expiresIn: '7d' },
      );

      return reply.status(201).send({ user, token });
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
        { id: user.id, email: user.email, name: user.name },
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

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'An error occurred during login',
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
}

export const authController = new AuthController();
