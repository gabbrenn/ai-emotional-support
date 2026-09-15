import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodApi } from '../services/api';
const MOOD_LABELS = {
    1: 'Very difficult',
    2: 'Difficult',
    3: 'Okay',
    4: 'Good',
    5: 'Very good',
};
const MOOD_EMOJI = {
    1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😊',
};
export default function Dashboard() {
    const { user } = useAuth();
    const [todayMood, setTodayMood] = useState(null);
    const [recentMoods, setRecentMoods] = useState([]);
    const [loadingMood, setLoadingMood] = useState(true);
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return 'Good morning';
        if (hour < 18)
            return 'Good afternoon';
        return 'Good evening';
    };
    useEffect(() => {
        async function fetchMoodData() {
            setLoadingMood(true);
            try {
                const [todayRes, moodsRes] = await Promise.all([
                    moodApi.getTodayMood(),
                    moodApi.getMoods(7),
                ]);
                setTodayMood(todayRes.mood);
                setRecentMoods(moodsRes.moods);
            }
            catch {
                // non-fatal
            }
            finally {
                setLoadingMood(false);
            }
        }
        fetchMoodData();
    }, []);
    const weeklyCount = recentMoods.length;
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight", children: [getGreeting(), ", ", user?.name || 'Friend'] }), _jsx("p", { className: "text-slate-600 text-sm", children: "Welcome back. Take a moment to pause and check in with yourself today." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2", children: "Today's Check-In" }), loadingMood ? (_jsx("p", { className: "text-sm text-slate-400", children: "Loading\u2026" })) : todayMood ? (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-3xl select-none", children: MOOD_EMOJI[todayMood.moodScore] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: MOOD_LABELS[todayMood.moodScore] }), todayMood.note && (_jsxs("p", { className: "text-xs text-slate-500 mt-0.5 line-clamp-2", children: ["\"", todayMood.note, "\""] }))] })] })) : (_jsx("p", { className: "text-sm text-slate-600", children: "No check-in recorded yet today." })), !loadingMood && (_jsx("p", { className: "text-xs text-slate-400", children: weeklyCount > 0
                                            ? `${weeklyCount} check-in${weeklyCount === 1 ? '' : 's'} in the last 7 days`
                                            : 'No check-ins in the last 7 days' }))] }), _jsx(Link, { to: "/mood", id: "link-mood-checkin", className: "inline-flex items-center justify-center px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition w-full sm:w-auto mt-2", children: todayMood ? 'View mood history' : 'Check in now' })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2", children: "Talk to someone" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-slate-500", children: "Safe, confidential reflection" }), _jsx("p", { className: "text-sm text-slate-800 leading-relaxed mt-1", children: "I'm here to listen whenever you need a calm, non-judgmental space to reflect." })] })] }), _jsxs(Link, { to: "/chat", id: "link-start-chat", className: "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition w-full sm:w-auto mt-2", children: [_jsx("span", { children: "\uD83D\uDCAC" }), _jsx("span", { children: "Start a conversation" })] })] })] }), _jsxs("div", { className: "p-4 rounded-lg bg-slate-100/70 border border-slate-200 text-slate-600 text-xs flex items-start gap-3", children: [_jsx("span", { className: "text-base select-none", children: "\u2139\uFE0F" }), _jsxs("div", { className: "space-y-0.5", children: [_jsx("p", { className: "font-semibold text-slate-800", children: "MindCare AI is an emotional support companion" }), _jsx("p", { className: "text-[11px] leading-relaxed", children: "If you are experiencing an urgent crisis or distress, please consult a qualified mental health professional or emergency service." })] })] })] }));
}
//# sourceMappingURL=Dashboard.js.map