import { db } from '../db/index.js';
import { conversations, messages } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import type { ChatMessage } from './ai.service.js';

/**
 * Generates a short title from the first user message.
 * No second AI call — simple local strategy.
 */
export function generateTitle(firstMessage: string): string {
  const clean = firstMessage.replace(/[^\w\s'-]/g, '').trim();
  const words = clean.split(/\s+/).slice(0, 6).join(' ');
  if (!words) return 'New conversation';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// ─── Conversation operations ──────────────────────────────────────────────────

export async function createConversation(userId: number) {
  const result = await db
    .insert(conversations)
    .values({ userId, title: 'New conversation' })
    .returning();
  return result[0];
}

export async function listConversations(userId: number) {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(id: number, userId: number) {
  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, userId)));
  return conv ?? null;
}

export async function updateConversationTitle(id: number, title: string) {
  await db
    .update(conversations)
    .set({ title, updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, id));
}

export async function updateConversationTimestamp(id: number) {
  await db
    .update(conversations)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, id));
}

// ─── Message operations ───────────────────────────────────────────────────────

export async function getMessagesByConversation(conversationId: number) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function saveMessage(
  conversationId: number,
  sender: 'user' | 'assistant',
  content: string,
  riskLevel: 'low' | 'moderate' | 'high',
) {
  const result = await db
    .insert(messages)
    .values({ conversationId, sender, content, riskLevel })
    .returning();
  return result[0];
}

/**
 * Retrieves the last N messages and formats them as AI chat history.
 */
export async function buildChatHistory(
  conversationId: number,
  limit = 20,
): Promise<ChatMessage[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  // Reverse so oldest comes first (chronological order for AI context)
  return rows.reverse().map((m) => ({
    role: m.sender as 'user' | 'assistant',
    content: m.content,
  }));
}
