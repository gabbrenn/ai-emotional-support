import type { FastifyPluginAsync } from 'fastify';
import { requireAuth } from '../plugins/auth.js';
import { conversationController } from '../controllers/conversation.controller.js';

const conversationRoutes: FastifyPluginAsync = async (app) => {
  // All conversation routes require authentication
  app.addHook('preHandler', requireAuth);

  // POST /api/conversations – create a new conversation
  app.post('/', conversationController.create.bind(conversationController));

  // GET /api/conversations – list user's conversations
  app.get('/', conversationController.list.bind(conversationController));

  // GET /api/conversations/:id – get conversation with messages
  app.get('/:id', conversationController.getOne.bind(conversationController));

  // POST /api/conversations/:id/messages – send a message
  app.post('/:id/messages', conversationController.sendMessage.bind(conversationController));
};

export default conversationRoutes;
