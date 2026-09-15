import { config } from '../config/index.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are a warm and empathetic wellbeing companion named MindCare. Your role is to provide emotional support and a safe, non-judgmental space for people to talk about how they are feeling.

You must:
- Listen actively and acknowledge the user's feelings with genuine empathy
- Respond in a calm, warm, and human tone — not clinical or robotic
- Ask thoughtful follow-up questions when appropriate to better understand the user
- Offer practical general wellbeing suggestions (breathing, journaling, rest, talking to someone) when relevant
- Encourage healthy coping strategies
- Gently encourage professional support when the person seems to be struggling significantly

You must never:
- Diagnose mental health conditions
- Prescribe or recommend medication
- Claim to be a therapist, psychologist, or medical professional
- Provide emergency crisis care (if the person is in danger, encourage them to contact emergency services)
- Make the user dependent on the AI
- Add excessive disclaimers to every single response — be natural and human

Keep your responses concise and conversational. You are a supportive friend, not a textbook.`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AiService {
  /**
   * Sends conversation history to OpenRouter and returns the AI's reply.
   */
  async getResponse(history: ChatMessage[]): Promise<string> {
    if (!config.openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mindcare-ai.local',
          'X-Title': 'MindCare AI',
        },
        body: JSON.stringify({
          model: config.openRouterModel,
          messages,
          max_tokens: 800,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        // Log server-side but do NOT expose API details to frontend
        console.error('[AI] OpenRouter error:', res.status, errText.slice(0, 200));
        throw new Error(`AI_PROVIDER_ERROR:${res.status}`);
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        error?: { message?: string };
      };

      if (data.error) {
        console.error('[AI] OpenRouter returned error:', data.error.message);
        throw new Error('AI_PROVIDER_ERROR:response');
      }

      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('AI_EMPTY_RESPONSE');
      }

      return content;
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string };
      if (e.name === 'AbortError') {
        throw new Error('AI_TIMEOUT');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const aiService = new AiService();

/**
 * Translates internal AI errors to user-friendly messages.
 */
export function getAiErrorMessage(err: unknown): string {
  const e = err as { message?: string };
  const msg = e.message ?? '';

  if (msg.startsWith('AI_TIMEOUT')) {
    return "I'm taking a bit too long to respond. Please try sending your message again.";
  }
  if (msg.startsWith('AI_EMPTY_RESPONSE')) {
    return "I wasn't able to form a response. Could you rephrase what you said?";
  }
  if (msg.startsWith('AI_PROVIDER_ERROR') || msg.startsWith('OPENROUTER')) {
    return "I'm having trouble responding right now. Please try again in a moment.";
  }
  if (msg.includes('OPENROUTER_API_KEY')) {
    return 'The AI service is not configured yet. Please contact the administrator.';
  }
  return "I'm having trouble responding right now. Please try again in a moment.";
}
