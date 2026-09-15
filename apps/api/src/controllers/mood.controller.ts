import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { createMoodSchema } from '../schemas/mood.schema.js';
import { createMood, getMoodsByUser, getTodayMood } from '../services/mood.service.js';

export class MoodController {
  /**
   * POST /api/moods
   * Create a new mood check-in for the authenticated user.
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const parsed = createMoodSchema.parse(request.body);
      const mood = await createMood(userId, parsed.mood, parsed.note);
      return reply.status(201).send(mood);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: err.errors[0]?.message ?? 'Validation failed',
          statusCode: 400,
        });
      }
      return reply.status(500).send({ error: 'Failed to save check-in', statusCode: 500 });
    }
  }

  /**
   * GET /api/moods
   * List the authenticated user's mood history (newest first, up to 30).
   */
  async list(request: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const limit = Math.min(Number(request.query.limit ?? 30), 30);
      const userMoods = await getMoodsByUser(userId, isNaN(limit) ? 30 : limit);
      return reply.status(200).send({ moods: userMoods });
    } catch {
      return reply.status(500).send({ error: 'Failed to retrieve mood history', statusCode: 500 });
    }
  }

  /**
   * GET /api/moods/today
   * Returns today's mood entry (or null) for the authenticated user.
   */
  async today(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const mood = await getTodayMood(userId);
      return reply.status(200).send({ mood });
    } catch {
      return reply.status(500).send({ error: 'Failed to retrieve today\'s mood', statusCode: 500 });
    }
  }
}

export const moodController = new MoodController();
