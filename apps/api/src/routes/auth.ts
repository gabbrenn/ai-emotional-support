import type { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../plugins/auth.js';

const authRoutes: FastifyPluginAsync = async (app) => {
  // Public routes
  app.post('/register', authController.register);
  app.post('/login', authController.login);

  // Protected routes
  app.get('/me', { preHandler: [requireAuth] }, authController.me);
};

export default authRoutes;
