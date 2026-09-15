import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
export default function StatusPage() {
    const [backendStatus, setBackendStatus] = useState('checking');
    const [lastChecked, setLastChecked] = useState(null);
    useEffect(() => {
        const ping = async () => {
            try {
                const result = await checkHealth();
                setLastChecked(new Date(result.timestamp).toLocaleTimeString());
                setBackendStatus('connected');
            }
            catch {
                setBackendStatus('unreachable');
            }
        };
        ping();
    }, []);
    const statusConfig = {
        checking: {
            color: 'text-amber-700 bg-amber-50 border-amber-200',
            dot: 'bg-amber-500',
            label: 'Checking…',
        },
        connected: {
            color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            dot: 'bg-emerald-500',
            label: 'Connected',
        },
        unreachable: {
            color: 'text-red-700 bg-red-50 border-red-200',
            dot: 'bg-red-500',
            label: 'Unreachable',
        },
    };
    const s = statusConfig[backendStatus];
    return (_jsx("main", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md space-y-6", children: [_jsxs("div", { className: "text-center space-y-1", children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight", children: "MindCare AI" }), _jsx("p", { className: "text-slate-500 text-xs", children: "System diagnostics and environment status" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs", children: [_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), _jsx("span", { className: "text-xs font-semibold text-slate-700", children: "Frontend client" })] }), _jsx("span", { className: "text-xs font-semibold text-emerald-700", children: "Online" })] }), _jsxs("div", { className: `flex items-center justify-between p-3 rounded-lg border ${s.color}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: `h-2 w-2 rounded-full ${s.dot}` }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold", children: "Backend API" }), lastChecked && backendStatus === 'connected' && (_jsxs("p", { className: "text-[10px] opacity-75", children: ["Checked at ", lastChecked] }))] })] }), _jsx("span", { className: "text-xs font-semibold", children: s.label })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 space-y-2.5 shadow-xs text-xs", children: [_jsx("p", { className: "font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-2", children: "Local Configuration" }), _jsxs("div", { className: "flex items-center justify-between text-slate-600", children: [_jsx("span", { children: "Frontend" }), _jsx("code", { className: "text-slate-800 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded", children: "http://localhost:5173" })] }), _jsxs("div", { className: "flex items-center justify-between text-slate-600", children: [_jsx("span", { children: "Backend API" }), _jsx("code", { className: "text-slate-800 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded", children: "http://localhost:3000" })] })] }), _jsx("p", { className: "text-center text-[11px] text-slate-400", children: "MindCare AI \u00B7 Wellbeing Assistant" })] }) }));
}
//# sourceMappingURL=StatusPage.js.map