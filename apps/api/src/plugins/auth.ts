import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import type { UserRole } from '@ai-esa/shared';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: UserPayload;
    user: UserPayload;
  }
}

/**
 * Reusable preHandler hook to protect routes requiring authentication.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({
      error: 'Unauthorized: Invalid or missing authentication token',
      statusCode: 401,
    });
  }
}

/**
 * Reusable preHandler hook to protect admin-only routes.
 * 1. Verifies JWT authentication (401 if unauthenticated).
 * 2. Checks user status and role in database (403 if not active admin).
 */
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  await requireAuth(request, reply);
  if (reply.sent) return;

  try {
    const [dbUser] = await db
      .select({ id: users.id, role: users.role, isActive: users.isActive })
      .from(users)
      .where(eq(users.id, request.user.id))
      .limit(1);

    if (!dbUser || !dbUser.isActive) {
      return reply.status(403).send({
        error: 'Forbidden: Account is deactivated or not found',
        statusCode: 403,
      });
    }

    if (dbUser.role !== 'admin') {
      return reply.status(403).send({
        error: 'Forbidden: Administrator privileges required',
        statusCode: 403,
      });
    }
  } catch (err) {
    return reply.status(500).send({
      error: 'Failed to verify admin privileges',
      statusCode: 500,
    });
  }
}

