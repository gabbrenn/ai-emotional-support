import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isChatRoute = location.pathname.startsWith('/chat');
    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };
    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { label: 'AI Chat', path: '/chat', icon: '💬' },
        { label: 'My Mood', path: '/mood', icon: '📊' },
        { label: 'Resources', path: '/resources', icon: '🌱' },
        { label: 'Profile', path: '/profile', icon: '👤' },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row", children: [_jsxs("header", { className: "md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83C\uDF31" }), _jsx("span", { className: "font-semibold text-slate-900 tracking-tight", children: "MindCare AI" })] }), _jsx("button", { type: "button", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600", "aria-label": isMobileMenuOpen ? 'Close menu' : 'Open menu', children: isMobileMenuOpen ? '✕' : '☰' })] }), _jsxs("aside", { className: `${isMobileMenuOpen ? 'block' : 'hidden'} md:flex flex-col w-full md:w-64 border-r border-slate-200 bg-white p-5 shrink-0 z-20`, children: [_jsxs("div", { className: "hidden md:flex items-center gap-3 px-2 mb-8", children: [_jsx("div", { className: "h-9 w-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-lg", children: "\uD83C\uDF31" }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-slate-900 tracking-tight text-base leading-none", children: "MindCare AI" }), _jsx("div", { className: "text-[11px] text-slate-500 mt-1", children: "Emotional Support" })] })] }), _jsx("nav", { className: "space-y-1 flex-1", "aria-label": "Main Navigation", children: navItems.map((item) => (_jsxs(NavLink, { to: item.path, onClick: () => setIsMobileMenuOpen(false), className: ({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition ${isActive
                                ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 border-teal-600'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'}`, children: [_jsx("span", { className: "text-base leading-none select-none", children: item.icon }), _jsx("span", { children: item.label })] }, item.path))) }), _jsxs("div", { className: "pt-4 border-t border-slate-100 mt-auto space-y-3", children: [_jsxs("div", { className: "px-2", children: [_jsx("p", { className: "text-xs font-semibold text-slate-800 truncate", children: user?.name }), _jsx("p", { className: "text-[11px] text-slate-500 truncate", children: user?.email })] }), _jsxs("button", { type: "button", onClick: handleLogout, className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer", children: [_jsx("span", { children: "\uD83D\uDEAA" }), _jsx("span", { children: "Sign out" })] })] })] }), _jsx("main", { className: isChatRoute
                    ? 'flex-1 overflow-hidden flex flex-col'
                    : 'flex-1 p-4 sm:p-6 md:p-10 max-w-5xl overflow-y-auto', children: _jsx(Outlet, {}) })] }));
}
//# sourceMappingURL=AppLayout.js.map