import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email.trim() || !password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        }
        catch (err) {
            const e = err;
            setError(e.message ?? 'Failed to log in. Please check your credentials.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("main", { className: "min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md px-4", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "inline-flex items-center justify-center h-10 w-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xl font-semibold mb-3", children: "\uD83C\uDF31" }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight", children: "MindCare AI" }), _jsx("p", { className: "text-sm text-slate-600 mt-1", children: "A private space to talk, reflect, and find support." })] }), _jsxs("div", { className: "bg-white py-8 px-6 sm:px-8 rounded-xl border border-slate-200 shadow-sm space-y-6", children: [_jsxs("div", { className: "border-b border-slate-100 pb-4", children: [_jsx("h2", { className: "text-lg font-medium text-slate-900", children: "Sign in to your account" }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Enter your email and password below" })] }), error && (_jsxs("div", { role: "alert", className: "p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5", children: [_jsx("span", { className: "text-base leading-none select-none", children: "\u26A0\uFE0F" }), _jsx("span", { className: "flex-1", children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-xs font-semibold text-slate-700 mb-1.5", children: "Email address" }), _jsx("input", { id: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "name@example.com", className: "w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-xs font-semibold text-slate-700 mb-1.5", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700 px-1.5 py-1 rounded", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? 'Hide' : 'Show' })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full mt-1 py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }), _jsx("span", { children: "Signing in..." })] })) : ('Sign In') })] }), _jsxs("div", { className: "text-center text-xs text-slate-600 pt-3 border-t border-slate-100", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-teal-700 hover:text-teal-800 font-semibold underline-offset-4 hover:underline", children: "Create one" })] })] }), _jsx("p", { className: "text-center text-xs text-slate-400 mt-6 max-w-sm mx-auto leading-relaxed", children: "MindCare AI provides general emotional support and is not a replacement for professional clinical care." })] }) }));
}
//# sourceMappingURL=Login.js.map