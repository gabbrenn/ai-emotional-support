import type { FastifyPluginAsync } from 'fastify';
import { adminController } from '../controllers/admin.controller.js';
import { requireAdmin } from '../plugins/auth.js';

const adminRoutes: FastifyPluginAsync = async (app) => {
  // All admin routes strictly require admin privileges
  app.addHook('preHandler', requireAdmin);

  app.get('/stats', adminController.getStats);
  app.get('/users', adminController.getUsers);
  app.patch('/users/:id/role', adminController.updateUserRole);
  app.patch('/users/:id/status', adminController.updateUserStatus);
};

export default adminRoutes;
