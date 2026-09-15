import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { moodApi } from '../services/api';
// ─── Constants ────────────────────────────────────────────────────────────────
const MOOD_OPTIONS = [
    { score: 1, label: 'Very difficult', emoji: '😔' },
    { score: 2, label: 'Difficult', emoji: '😕' },
    { score: 3, label: 'Okay', emoji: '😐' },
    { score: 4, label: 'Good', emoji: '🙂' },
    { score: 5, label: 'Very good', emoji: '😊' },
];
const MAX_NOTE_LENGTH = 500;
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMoodLabel(score) {
    return MOOD_OPTIONS.find((m) => m.score === score)?.label ?? `Score ${score}`;
}
function getMoodEmoji(score) {
    return MOOD_OPTIONS.find((m) => m.score === score)?.emoji ?? '—';
}
function formatDate(isoString) {
    const date = new Date(isoString + (isoString.includes('Z') || isoString.includes('+') ? '' : 'Z'));
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-GB');
    const entryStr = date.toLocaleDateString('en-GB');
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-GB');
    if (entryStr === todayStr)
        return 'Today';
    if (entryStr === yesterdayStr)
        return 'Yesterday';
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}
function isToday(isoString) {
    const today = new Date().toISOString().slice(0, 10);
    return isoString.slice(0, 10) === today;
}
function WeeklyChart({ moods }) {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('en-GB', { weekday: 'short' });
        const entry = moods.find((m) => m.createdAt.slice(0, 10) === dateStr);
        days.push({ label, date: dateStr, score: entry?.moodScore ?? null });
    }
    const W = 320;
    const H = 120;
    const padX = 24;
    const padY = 16;
    const chartW = W - padX * 2;
    const chartH = H - padY * 2;
    const colW = chartW / 6;
    // Y scale: score 1–5 maps to chart height (inverted for SVG)
    const yPos = (score) => padY + chartH - ((score - 1) / 4) * chartH;
    const xPos = (i) => padX + i * colW;
    // Build polyline points from existing scores only
    const points = days
        .map((d, i) => (d.score !== null ? `${xPos(i)},${yPos(d.score)}` : null))
        .filter(Boolean)
        .join(' ');
    return (_jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-700 mb-1", children: "Your mood check-ins over the last 7 days" }), _jsx("p", { className: "text-xs text-slate-400 mb-4", children: "A reflection of your recorded check-ins \u2014 not a medical measurement." }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("svg", { viewBox: `0 0 ${W} ${H}`, className: "w-full", style: { minWidth: 280 }, "aria-label": "7-day mood chart", role: "img", children: [[1, 2, 3, 4, 5].map((s) => (_jsx("line", { x1: padX, x2: W - padX, y1: yPos(s), y2: yPos(s), stroke: "#e2e8f0", strokeWidth: "1" }, s))), [1, 3, 5].map((s) => (_jsx("text", { x: padX - 4, y: yPos(s) + 4, textAnchor: "end", fontSize: "9", fill: "#94a3b8", children: s }, s))), points && (_jsx("polyline", { points: points, fill: "none", stroke: "#0d9488", strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round" })), days.map((d, i) => d.score !== null ? (_jsx("circle", { cx: xPos(i), cy: yPos(d.score), r: "4", fill: "#0d9488", stroke: "white", strokeWidth: "2", children: _jsx("title", { children: `${d.label}: ${getMoodLabel(d.score)}` }) }, d.date)) : null), days.map((d, i) => (_jsx("text", { x: xPos(i), y: H - 2, textAnchor: "middle", fontSize: "9", fill: d.date === new Date().toISOString().slice(0, 10) ? '#0d9488' : '#94a3b8', fontWeight: d.date === new Date().toISOString().slice(0, 10) ? '600' : '400', children: d.label }, d.date)))] }) })] }));
}
// ─── Mood History List ────────────────────────────────────────────────────────
function MoodHistory({ moods }) {
    if (moods.length === 0) {
        return (_jsx("div", { className: "text-center py-10 text-slate-400 text-sm", children: "No check-ins yet. Your mood history will appear here after your first check-in." }));
    }
    return (_jsx("ul", { className: "divide-y divide-slate-100", role: "list", children: moods.map((m) => (_jsxs("li", { className: "py-4 flex items-start gap-4", children: [_jsx("span", { className: "text-2xl select-none mt-0.5", "aria-hidden": "true", children: getMoodEmoji(m.moodScore) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-semibold text-slate-800", children: getMoodLabel(m.moodScore) }), _jsx("span", { className: "text-xs text-slate-400 shrink-0", children: formatDate(m.createdAt) })] }), m.note && (_jsxs("p", { className: "text-sm text-slate-600 mt-1 leading-relaxed", children: ["\"", m.note, "\""] }))] })] }, m.id))) }));
}
// ─── Main Mood Page ───────────────────────────────────────────────────────────
export default function MoodPage() {
    const [moods, setMoods] = useState([]);
    const [todayMood, setTodayMood] = useState(null);
    const [loading, setLoading] = useState(true);
    // Form state
    const [selectedScore, setSelectedScore] = useState(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [moodsRes, todayRes] = await Promise.all([
                moodApi.getMoods(30),
                moodApi.getTodayMood(),
            ]);
            setMoods(moodsRes.moods);
            setTodayMood(todayRes.mood);
        }
        catch {
            // non-fatal, UI degrades gracefully
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadData();
    }, [loadData]);
    async function handleSubmit(e) {
        e.preventDefault();
        if (selectedScore === null) {
            setError('Please select a mood before saving.');
            return;
        }
        if (note.length > MAX_NOTE_LENGTH) {
            setError(`Your note must be ${MAX_NOTE_LENGTH} characters or less.`);
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const newMood = await moodApi.createMood(selectedScore, note.trim() || undefined);
            setTodayMood(newMood);
            setMoods((prev) => [newMood, ...prev.filter((m) => !isToday(m.createdAt))]);
            setSuccess(true);
            setSelectedScore(null);
            setNote('');
        }
        catch (err) {
            const e = err;
            setError(e.message ?? "We couldn't save your check-in right now. Please try again.");
        }
        finally {
            setSaving(false);
        }
    }
    const alreadyCheckedIn = todayMood !== null;
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight", children: "Daily Check-In" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "A simple space to track how you're feeling each day." })] }), _jsx("div", { className: "bg-white border border-slate-200 rounded-xl p-6 shadow-xs", children: loading ? (_jsx("p", { className: "text-slate-400 text-sm", children: "Loading\u2026" })) : alreadyCheckedIn && !success ? (
                /* Already checked in today */
                _jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "text-base font-semibold text-slate-900", children: "Today's check-in" }), _jsxs("div", { className: "flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg", children: [_jsx("span", { className: "text-3xl select-none", children: getMoodEmoji(todayMood.moodScore) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-teal-800", children: getMoodLabel(todayMood.moodScore) }), todayMood.note && (_jsxs("p", { className: "text-xs text-teal-700 mt-0.5", children: ["\"", todayMood.note, "\""] }))] })] }), _jsx("p", { className: "text-xs text-slate-500", children: "You've already checked in today. Come back tomorrow for your next check-in." })] })) : (
                /* Check-in form */
                _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [success && (_jsxs("div", { className: "flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-sm px-4 py-3 rounded-lg", role: "status", children: [_jsx("span", { children: "\u2713" }), _jsx("span", { children: "Check-in saved! See your history below." })] })), _jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold text-slate-900 mb-4", children: "How are you feeling today?" }), _jsx("div", { className: "grid grid-cols-5 gap-2", role: "radiogroup", "aria-label": "Mood selector", children: MOOD_OPTIONS.map((opt) => {
                                        const isSelected = selectedScore === opt.score;
                                        return (_jsxs("button", { type: "button", id: `mood-option-${opt.score}`, role: "radio", "aria-checked": isSelected, onClick: () => { setSelectedScore(opt.score); setSuccess(false); }, className: `flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${isSelected
                                                ? 'border-teal-600 bg-teal-50 text-teal-900'
                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'}`, children: [_jsx("span", { className: "text-2xl select-none", "aria-hidden": "true", children: opt.emoji }), _jsx("span", { className: "text-[10px] font-medium text-center leading-tight", children: opt.label }), isSelected && (_jsx("span", { className: "sr-only", children: " (selected)" }))] }, opt.score));
                                    }) })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "mood-note", className: "block text-sm font-medium text-slate-700 mb-1.5", children: ["Want to add a note? ", _jsx("span", { className: "text-slate-400 font-normal", children: "(Optional)" })] }), _jsx("textarea", { id: "mood-note", value: note, onChange: (e) => setNote(e.target.value), rows: 3, maxLength: MAX_NOTE_LENGTH, placeholder: "How was your day? What's on your mind?", className: "w-full resize-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" }), _jsxs("p", { className: `text-xs mt-1 text-right ${note.length > MAX_NOTE_LENGTH ? 'text-red-500' : 'text-slate-400'}`, children: [note.length, "/", MAX_NOTE_LENGTH] })] }), error && (_jsx("p", { className: "text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-lg", role: "alert", children: error })), _jsx("button", { id: "btn-save-checkin", type: "submit", disabled: saving || selectedScore === null, className: "w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-medium text-sm px-6 py-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed", children: saving ? 'Saving…' : 'Save Check-In' })] })) }), !loading && _jsx(WeeklyChart, { moods: moods }), _jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-6 shadow-xs", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4", children: "Mood History" }), loading ? (_jsx("p", { className: "text-slate-400 text-sm", children: "Loading\u2026" })) : (_jsx(MoodHistory, { moods: moods }))] }), _jsx("p", { className: "text-xs text-slate-400 text-center pb-4", children: "Mood tracking is a personal reflection tool and is not a medical diagnosis." })] }));
}
//# sourceMappingURL=Mood.js.map