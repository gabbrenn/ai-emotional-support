import type { FastifyRequest, FastifyReply } from 'fastify';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
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
