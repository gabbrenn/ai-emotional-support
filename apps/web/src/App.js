import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Mood from './pages/Mood';
import PlaceholderPage from './pages/PlaceholderPage';
import StatusPage from './pages/StatusPage';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/status", element: _jsx(StatusPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/chat", element: _jsx(Chat, {}) }), _jsx(Route, { path: "/mood", element: _jsx(Mood, {}) }), _jsx(Route, { path: "/resources", element: _jsx(PlaceholderPage, { title: "Wellness Resources", description: "Grounding exercises, coping strategies, and mental health helplines", icon: "\uD83C\uDF31" }) }), _jsx(Route, { path: "/profile", element: _jsx(PlaceholderPage, { title: "Account & Profile", description: "Manage your account settings and preferences", icon: "\u2699\uFE0F" }) })] }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) }));
}
//# sourceMappingURL=App.js.map