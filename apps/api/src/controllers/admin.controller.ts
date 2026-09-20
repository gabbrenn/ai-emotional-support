import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { adminService } from '../services/admin.service.js';
import {
  adminUsersQuerySchema,
  adminUpdateRoleSchema,
  adminUpdateStatusSchema,
  adminUserParamsSchema,
} from '../schemas/admin.schema.js';

export class AdminController {
  /**
   * GET /api/admin/stats
   */
  async getStats(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await adminService.getStats();
      return reply.status(200).send(stats);
    } catch (err: unknown) {
      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'Failed to retrieve admin statistics',
        statusCode,
      });
    }
  }

  /**
   * GET /api/admin/users
   */
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = adminUsersQuerySchema.parse(request.query);
      const users = await adminService.getUsers(query.search);
      return reply.status(200).send({ users });
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Invalid query parameters',
          statusCode: 400,
        });
      }

      const customErr = err as { statusCode?: number; message?: string };
      const statusCode = customErr.statusCode ?? 500;
      return reply.status(statusCode).send({
        error: customErr.message ?? 'Failed to retrieve users',
        statusCode,
      });
    }
  }

  /**
   * PATCH /api/admin/users/:id/role
   */
  async updateUserRole(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = adminUserParamsSchema.parse(request.params);
      const body = adminUpdateRoleSchema.parse(request.body);

      const adminUserId = request.user.id;
      const updatedUser = await adminService.updateUserRole(
        adminUserId,
        params.id,
        body.role
      );

      return reply.status(200).send({ user: updatedUser });
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
        error: customErr.message ?? 'Failed to update user role',
        statusCode,
      });
    }
  }

  /**
   * PATCH /api/admin/users/:id/status
   */
  async updateUserStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = adminUserParamsSchema.parse(request.params);
      const body = adminUpdateStatusSchema.parse(request.body);

      const adminUserId = request.user.id;
      const updatedUser = await adminService.updateUserStatus(
        adminUserId,
        params.id,
        body.isActive
      );

      return reply.status(200).send({ user: updatedUser });
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
        error: customErr.message ?? 'Failed to update user status',
        statusCode,
      });
    }
  }
}

export const adminController = new AdminController();
