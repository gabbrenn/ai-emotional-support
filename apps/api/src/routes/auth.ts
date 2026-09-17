import type { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../plugins/auth.js';

const authRoutes: FastifyPluginAsync = async (app) => {
  // Public routes
  app.post('/register', authController.register);
  app.post('/login', authController.login);
  app.post('/verify-email', authController.verifyEmail);
  app.post('/resend-verification', authController.resendVerification);
  app.post('/forgot-password', authController.forgotPassword);
  app.post('/reset-password', authController.resetPassword);

  // Protected routes
  app.get('/me', { preHandler: [requireAuth] }, authController.me);
  app.patch('/me', { preHandler: [requireAuth] }, authController.updateProfile);
  app.patch('/password', { preHandler: [requireAuth] }, authController.changePassword);
};

export default authRoutes;
