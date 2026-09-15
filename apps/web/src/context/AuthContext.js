import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, tokenStorage } from '../services/api';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(tokenStorage.get());
    const [isLoading, setIsLoading] = useState(true);
    const logout = useCallback(() => {
        tokenStorage.remove();
        setToken(null);
        setUser(null);
    }, []);
    // Check auth state on startup if a token is present
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = tokenStorage.get();
            if (!storedToken) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await authApi.getMe();
                setUser(response.user);
                setToken(storedToken);
            }
            catch {
                // Token is invalid, expired, or server unreachable
                logout();
            }
            finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, [logout]);
    const login = async (payload) => {
        const response = await authApi.login(payload);
        tokenStorage.set(response.token);
        setToken(response.token);
        setUser(response.user);
    };
    const register = async (payload) => {
        const response = await authApi.register(payload);
        tokenStorage.set(response.token);
        setToken(response.token);
        setUser(response.user);
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
//# sourceMappingURL=AuthContext.js.map