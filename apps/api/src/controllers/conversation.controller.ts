import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { sendMessageSchema } from '../schemas/conversation.schema.js';
import {
  createConversation,
  listConversations,
  getConversationById,
  getMessagesByConversation,
  saveMessage,
  buildChatHistory,
  generateTitle,
  updateConversationTitle,
  updateConversationTimestamp,
} from '../services/conversation.service.js';
import { aiService, getAiErrorMessage } from '../services/ai.service.js';
import { classifyRisk, CRISIS_RESPONSE } from '../services/risk.service.js';

// ─── Conversations ────────────────────────────────────────────────────────────

export class ConversationController {
  /**
   * POST /api/conversations
   * Create a new conversation for the authenticated user.
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const conversation = await createConversation(userId);
      return reply.status(201).send({ conversation });
    } catch {
      return reply.status(500).send({
        error: 'Failed to create conversation',
        statusCode: 500,
      });
    }
  }

  /**
   * GET /api/conversations
   * List all conversations for the authenticated user, newest first.
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const convs = await listConversations(userId);
      return reply.status(200).send({ conversations: convs });
    } catch {
      return reply.status(500).send({
        error: 'Failed to retrieve conversations',
        statusCode: 500,
      });
    }
  }

  /**
   * GET /api/conversations/:id
   * Get a single conversation with its messages.
   * Enforces ownership — users cannot see other users' conversations.
   */
  async getOne(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const convId = Number(request.params.id);

      if (isNaN(convId)) {
        return reply.status(400).send({ error: 'Invalid conversation ID', statusCode: 400 });
      }

      const conversation = await getConversationById(convId, userId);
      if (!conversation) {
        return reply.status(404).send({ error: 'Conversation not found', statusCode: 404 });
      }

      const msgs = await getMessagesByConversation(convId);
      return reply.status(200).send({ conversation, messages: msgs });
    } catch {
      return reply.status(500).send({
        error: 'Failed to retrieve conversation',
        statusCode: 500,
      });
    }
  }

  /**
   * POST /api/conversations/:id/messages
   * Send a user message and receive an AI response.
   */
  async sendMessage(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = request.user.id;
    const convId = Number(request.params.id);

    if (isNaN(convId)) {
      return reply.status(400).send({ error: 'Invalid conversation ID', statusCode: 400 });
    }

    // Validate input
    let content: string;
    try {
      const parsed = sendMessageSchema.parse(request.body);
      content = parsed.content;
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
        });
      }
      return reply.status(400).send({ error: 'Invalid request body', statusCode: 400 });
    }

    // Verify conversation ownership
    const conversation = await getConversationById(convId, userId).catch(() => null);
    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found', statusCode: 404 });
    }

    // Classify risk before touching the AI
    const riskLevel = classifyRisk(content);

    // Save user message
    const userMessage = await saveMessage(convId, 'user', content, riskLevel).catch(() => null);
    if (!userMessage) {
      return reply.status(500).send({
        error: 'Failed to save your message. Please try again.',
        statusCode: 500,
      });
    }

    // Auto-generate title from the first user message
    if (conversation.title === 'New conversation') {
      const title = generateTitle(content);
      await updateConversationTitle(convId, title).catch(() => {/* non-fatal */});
    }

    // Handle high-risk: skip AI, return safe crisis response
    if (riskLevel === 'high') {
      const assistantMessage = await saveMessage(
        convId,
        'assistant',
        CRISIS_RESPONSE,
        'high',
      ).catch(() => null);

      await updateConversationTimestamp(convId).catch(() => {/* non-fatal */});

      return reply.status(200).send({
        userMessage,
        assistantMessage: assistantMessage ?? {
          id: -1,
          conversationId: convId,
          sender: 'assistant',
          content: CRISIS_RESPONSE,
          riskLevel: 'high',
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Normal flow: build history and get AI response
    let aiContent: string;
    try {
      const history = await buildChatHistory(convId, 20);
      aiContent = await aiService.getResponse(history);
    } catch (err) {
      // Return a friendly error; do NOT expose raw error details
      const friendlyMessage = getAiErrorMessage(err);
      return reply.status(502).send({
        error: friendlyMessage,
        statusCode: 502,
      });
    }

    // Save assistant message
    const assistantMessage = await saveMessage(convId, 'assistant', aiContent, 'low').catch(() => null);
    if (!assistantMessage) {
      return reply.status(500).send({
        error: 'AI responded but we could not save the message. Please try again.',
        statusCode: 500,
      });
    }

    await updateConversationTimestamp(convId).catch(() => {/* non-fatal */});

    return reply.status(200).send({ userMessage, assistantMessage });
  }
}

export const conversationController = new ConversationController();
