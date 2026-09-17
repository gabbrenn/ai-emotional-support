// ─── Sender / Risk level enums ───────────────────────────────────────────────
export type MessageSender = 'user' | 'assistant';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

// ─── API response envelope ────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
  details?: unknown;
}

// ─── Health check ─────────────────────────────────────────────────────────────
export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

// ─── User (Safe info) ─────────────────────────────────────────────────────────
export interface SafeUser {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

export interface MeResponse {
  user: SafeUser;
}

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// ─── Database Entities ────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

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
  sender: MessageSender;
  content: string;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface Mood {
  id: number;
  userId: number;
  mood: MoodType;
  note?: string;
  createdAt: string;
}
