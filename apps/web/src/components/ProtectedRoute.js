import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-950 text-slate-200", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" }), _jsx("p", { className: "text-sm text-slate-400", children: "Loading your session..." })] }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return children;
}
//# sourceMappingURL=ProtectedRoute.js.map