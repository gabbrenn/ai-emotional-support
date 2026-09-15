const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'mindcare_auth_token';
// Token storage helpers
export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token) => localStorage.setItem(TOKEN_KEY, token),
    remove: () => localStorage.removeItem(TOKEN_KEY),
};
async function request(path, options) {
    const url = `${BASE_URL}${path}`;
    const token = tokenStorage.get();
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
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
        }
        catch {
            // Use status text if JSON parse fails
            errorMessage = response.statusText || errorMessage;
        }
        const err = new Error(errorMessage);
        err.statusCode = response.status;
        throw err;
    }
    return response.json();
}
export const api = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    }),
    put: (path, body, options) => request(path, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
// ─── Health check ─────────────────────────────────────────────────────────────
export async function checkHealth() {
    return api.get('/api/health');
}
export const authApi = {
    register: (payload) => api.post('/api/auth/register', payload),
    login: (payload) => api.post('/api/auth/login', payload),
    getMe: () => api.get('/api/auth/me'),
};
// ─── Chat API ─────────────────────────────────────────────────────────────────
export const chatApi = {
    getConversations: () => api.get('/api/conversations'),
    createConversation: () => api.post('/api/conversations', {}),
    getConversation: (id) => api.get(`/api/conversations/${id}`),
    sendMessage: (id, content) => api.post(`/api/conversations/${id}/messages`, { content }),
};
// ─── Mood API ─────────────────────────────────────────────────────────────────
export const moodApi = {
    createMood: (moodScore, note) => api.post('/api/moods', { mood: moodScore, note }),
    getMoods: (limit = 30) => api.get(`/api/moods?limit=${limit}`),
    getTodayMood: () => api.get('/api/moods/today'),
};
//# sourceMappingURL=api.js.map