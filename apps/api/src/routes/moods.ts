import type { FastifyPluginAsync } from 'fastify';
import { requireAuth } from '../plugins/auth.js';
import { moodController } from '../controllers/mood.controller.js';

const moodRoutes: FastifyPluginAsync = async (app) => {
  // All mood routes require authentication
  app.addHook('preHandler', requireAuth);

  // GET /api/moods/today  — must be before /:id-style routes
  app.get('/today', moodController.today.bind(moodController));

  // GET /api/moods
  app.get('/', moodController.list.bind(moodController));

  // POST /api/moods
  app.post('/', moodController.create.bind(moodController));
};

export default moodRoutes;
