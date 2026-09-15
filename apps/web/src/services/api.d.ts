import type { AuthResponse, MeResponse } from '@ai-esa/shared';
export declare const tokenStorage: {
    get: () => string | null;
    set: (token: string) => void;
    remove: () => void;
};
export declare const api: {
    get: <T>(path: string, options?: RequestInit) => Promise<T>;
    post: <T>(path: string, body: unknown, options?: RequestInit) => Promise<T>;
    put: <T>(path: string, body: unknown, options?: RequestInit) => Promise<T>;
    delete: <T>(path: string, options?: RequestInit) => Promise<T>;
};
export declare function checkHealth(): Promise<{
    status: string;
    timestamp: string;
}>;
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}
export interface LoginPayload {
    email: string;
    password: string;
}
export declare const authApi: {
    register: (payload: RegisterPayload) => Promise<AuthResponse>;
    login: (payload: LoginPayload) => Promise<AuthResponse>;
    getMe: () => Promise<MeResponse>;
};
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
export declare const chatApi: {
    getConversations: () => Promise<{
        conversations: Conversation[];
    }>;
    createConversation: () => Promise<{
        conversation: Conversation;
    }>;
    getConversation: (id: number) => Promise<{
        conversation: Conversation;
        messages: Message[];
    }>;
    sendMessage: (id: number, content: string) => Promise<{
        userMessage: Message;
        assistantMessage: Message;
    }>;
};
export interface MoodEntry {
    id: number;
    userId: number;
    mood: string;
    moodScore: number;
    note: string | null;
    createdAt: string;
}
export declare const moodApi: {
    createMood: (moodScore: number, note?: string) => Promise<MoodEntry>;
    getMoods: (limit?: number) => Promise<{
        moods: MoodEntry[];
    }>;
    getTodayMood: () => Promise<{
        mood: MoodEntry | null;
    }>;
};
//# sourceMappingURL=api.d.ts.map