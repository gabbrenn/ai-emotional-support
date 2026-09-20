import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config/index.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversations.js';
import moodRoutes from './routes/moods.js';
import adminRoutes from './routes/admin.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.env === 'development' ? 'info' : 'warn',
      transport:
        config.env === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // ─── Plugins ─────────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: config.frontendUrl,
    credentials: true,
  });

  await app.register(jwt, {
    secret: config.jwtSecret,
  });

  // ─── Error handler ────────────────────────────────────────────────────────────
  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode ?? 500).send({
      error: error.message ?? 'Internal Server Error',
      statusCode: error.statusCode ?? 500,
    });
  });

  // ─── Routes ───────────────────────────────────────────────────────────────────
  await app.register(healthRoutes, { prefix: '/api' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(conversationRoutes, { prefix: '/api/conversations' });
  await app.register(moodRoutes, { prefix: '/api/moods' });
  await app.register(adminRoutes, { prefix: '/api/admin' });

  return app;
}
