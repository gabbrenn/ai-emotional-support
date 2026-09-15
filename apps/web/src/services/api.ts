import type { AuthResponse, MeResponse } from '@ai-esa/shared';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'mindcare_auth_token';

// Token storage helpers
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // Use status text if JSON parse fails
      errorMessage = response.statusText || errorMessage;
    }
    const err = new Error(errorMessage) as Error & { statusCode: number };
    err.statusCode = response.status;
    throw err;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

// ─── Health check ─────────────────────────────────────────────────────────────
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return api.get('/api/health');
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    api.post<AuthResponse>('/api/auth/register', payload),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    api.post<AuthResponse>('/api/auth/login', payload),

  getMe: (): Promise<MeResponse> =>
    api.get<MeResponse>('/api/auth/me'),
};

// ─── Chat / Conversation Types ────────────────────────────────────────────────

export interface Conversation {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  sender: 'user' | 'assistant';
  content: string;
  riskLevel: 'low' | 'moderate' | 'high';
  createdAt: string;
}

// ─── Chat API ─────────────────────────────────────────────────────────────────

export const chatApi = {
  getConversations: (): Promise<{ conversations: Conversation[] }> =>
    api.get('/api/conversations'),

  createConversation: (): Promise<{ conversation: Conversation }> =>
    api.post('/api/conversations', {}),

  getConversation: (id: number): Promise<{ conversation: Conversation; messages: Message[] }> =>
    api.get(`/api/conversations/${id}`),

  sendMessage: (id: number, content: string): Promise<{ userMessage: Message; assistantMessage: Message }> =>
    api.post(`/api/conversations/${id}/messages`, { content }),
};

// ─── Mood Types ───────────────────────────────────────────────────────────────

export interface MoodEntry {
  id: number;
  userId: number;
  mood: string;
  moodScore: number;
  note: string | null;
  createdAt: string;
}

// ─── Mood API ─────────────────────────────────────────────────────────────────

export const moodApi = {
  createMood: (moodScore: number, note?: string): Promise<MoodEntry> =>
    api.post('/api/moods', { mood: moodScore, note }),

  getMoods: (limit = 30): Promise<{ moods: MoodEntry[] }> =>
    api.get(`/api/moods?limit=${limit}`),

  getTodayMood: (): Promise<{ mood: MoodEntry | null }> =>
    api.get('/api/moods/today'),
};

