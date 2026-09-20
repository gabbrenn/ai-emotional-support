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

export type UserRole = 'user' | 'admin';

// ─── User (Safe info) ─────────────────────────────────────────────────────────
export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
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

// ─── Admin Dashboard Entities & APIs ──────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  totalConversations: number;
  totalMoodCheckins: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
}

export interface AdminUpdateRoleInput {
  role: UserRole;
}

export interface AdminUpdateStatusInput {
  isActive: boolean;
}

// ─── Database Entities ────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
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
