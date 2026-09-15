import { useState, useEffect, useCallback } from 'react';
import { moodApi, type MoodEntry } from '../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  { score: 1, label: 'Very difficult', emoji: '😔' },
  { score: 2, label: 'Difficult',      emoji: '😕' },
  { score: 3, label: 'Okay',           emoji: '😐' },
  { score: 4, label: 'Good',           emoji: '🙂' },
  { score: 5, label: 'Very good',      emoji: '😊' },
];

const MAX_NOTE_LENGTH = 500;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMoodLabel(score: number) {
  return MOOD_OPTIONS.find((m) => m.score === score)?.label ?? `Score ${score}`;
}

function getMoodEmoji(score: number) {
  return MOOD_OPTIONS.find((m) => m.score === score)?.emoji ?? '—';
}

function formatDate(isoString: string) {
  const date = new Date(isoString + (isoString.includes('Z') || isoString.includes('+') ? '' : 'Z'));
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-GB');
  const entryStr = date.toLocaleDateString('en-GB');
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-GB');

  if (entryStr === todayStr) return 'Today';
  if (entryStr === yesterdayStr) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}

function isToday(isoString: string) {
  const today = new Date().toISOString().slice(0, 10);
  return isoString.slice(0, 10) === today;
}

// ─── 7-Day SVG Chart ─────────────────────────────────────────────────────────

interface ChartDay {
  label: string;       // "Mon", "Tue", etc.
  date: string;        // YYYY-MM-DD
  score: number | null;
}

function WeeklyChart({ moods }: { moods: MoodEntry[] }) {
  const days: ChartDay[] = [];
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
  const yPos = (score: number) => padY + chartH - ((score - 1) / 4) * chartH;
  const xPos = (i: number) => padX + i * colW;

  // Build polyline points from existing scores only
  const points = days
    .map((d, i) => (d.score !== null ? `${xPos(i)},${yPos(d.score)}` : null))
    .filter(Boolean)
    .join(' ');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-700 mb-1">Your mood check-ins over the last 7 days</h3>
      <p className="text-xs text-slate-400 mb-4">A reflection of your recorded check-ins — not a medical measurement.</p>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: 280 }}
          aria-label="7-day mood chart"
          role="img"
        >
          {/* Y-axis grid lines */}
          {[1, 2, 3, 4, 5].map((s) => (
            <line
              key={s}
              x1={padX}
              x2={W - padX}
              y1={yPos(s)}
              y2={yPos(s)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis score labels */}
          {[1, 3, 5].map((s) => (
            <text
              key={s}
              x={padX - 4}
              y={yPos(s) + 4}
              textAnchor="end"
              fontSize="9"
              fill="#94a3b8"
            >
              {s}
            </text>
          ))}

          {/* Polyline connecting data points */}
          {points && (
            <polyline
              points={points}
              fill="none"
              stroke="#0d9488"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Data points */}
          {days.map((d, i) =>
            d.score !== null ? (
              <circle
                key={d.date}
                cx={xPos(i)}
                cy={yPos(d.score)}
                r="4"
                fill="#0d9488"
                stroke="white"
                strokeWidth="2"
              >
                <title>{`${d.label}: ${getMoodLabel(d.score)}`}</title>
              </circle>
            ) : null,
          )}

          {/* X-axis day labels */}
          {days.map((d, i) => (
            <text
              key={d.date}
              x={xPos(i)}
              y={H - 2}
              textAnchor="middle"
              fontSize="9"
              fill={d.date === new Date().toISOString().slice(0, 10) ? '#0d9488' : '#94a3b8'}
              fontWeight={d.date === new Date().toISOString().slice(0, 10) ? '600' : '400'}
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── Mood History List ────────────────────────────────────────────────────────

function MoodHistory({ moods }: { moods: MoodEntry[] }) {
  if (moods.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        No check-ins yet. Your mood history will appear here after your first check-in.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100" role="list">
      {moods.map((m) => (
        <li key={m.id} className="py-4 flex items-start gap-4">
          <span className="text-2xl select-none mt-0.5" aria-hidden="true">
            {getMoodEmoji(m.moodScore)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-800">
                {getMoodLabel(m.moodScore)}
              </span>
              <span className="text-xs text-slate-400 shrink-0">{formatDate(m.createdAt)}</span>
            </div>
            {m.note && (
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">"{m.note}"</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

// ─── Main Mood Page ───────────────────────────────────────────────────────────

export default function MoodPage() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [moodsRes, todayRes] = await Promise.all([
        moodApi.getMoods(30),
        moodApi.getTodayMood(),
      ]);
      setMoods(moodsRes.moods);
      setTodayMood(todayRes.mood);
    } catch {
      // non-fatal, UI degrades gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(e: React.FormEvent) {
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
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? "We couldn't save your check-in right now. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const alreadyCheckedIn = todayMood !== null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Check-In</h1>
        <p className="text-slate-500 text-sm mt-1">
          A simple space to track how you're feeling each day.
        </p>
      </div>

      {/* ── Check-In Card ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : alreadyCheckedIn && !success ? (
          /* Already checked in today */
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Today's check-in</h2>
            <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <span className="text-3xl select-none">{getMoodEmoji(todayMood.moodScore)}</span>
              <div>
                <p className="text-sm font-semibold text-teal-800">{getMoodLabel(todayMood.moodScore)}</p>
                {todayMood.note && (
                  <p className="text-xs text-teal-700 mt-0.5">"{todayMood.note}"</p>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              You've already checked in today. Come back tomorrow for your next check-in.
            </p>
          </div>
        ) : (
          /* Check-in form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div
                className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-sm px-4 py-3 rounded-lg"
                role="status"
              >
                <span>✓</span>
                <span>Check-in saved! See your history below.</span>
              </div>
            )}

            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-4">How are you feeling today?</h2>
              <div
                className="grid grid-cols-5 gap-2"
                role="radiogroup"
                aria-label="Mood selector"
              >
                {MOOD_OPTIONS.map((opt) => {
                  const isSelected = selectedScore === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      id={`mood-option-${opt.score}`}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => { setSelectedScore(opt.score); setSuccess(false); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl select-none" aria-hidden="true">{opt.emoji}</span>
                      <span className="text-[10px] font-medium text-center leading-tight">{opt.label}</span>
                      {isSelected && (
                        <span className="sr-only"> (selected)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="mood-note" className="block text-sm font-medium text-slate-700 mb-1.5">
                Want to add a note? <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="mood-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={MAX_NOTE_LENGTH}
                placeholder="How was your day? What's on your mind?"
                className="w-full resize-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
              <p className={`text-xs mt-1 text-right ${note.length > MAX_NOTE_LENGTH ? 'text-red-500' : 'text-slate-400'}`}>
                {note.length}/{MAX_NOTE_LENGTH}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-lg" role="alert">
                {error}
              </p>
            )}

            <button
              id="btn-save-checkin"
              type="submit"
              disabled={saving || selectedScore === null}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-medium text-sm px-6 py-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Check-In'}
            </button>
          </form>
        )}
      </div>

      {/* ── 7-Day Trend ── */}
      {!loading && <WeeklyChart moods={moods} />}

      {/* ── Mood History ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Mood History</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : (
          <MoodHistory moods={moods} />
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center pb-4">
        Mood tracking is a personal reflection tool and is not a medical diagnosis.
      </p>
    </div>
  );
}
