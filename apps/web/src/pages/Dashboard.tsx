import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodApi, type MoodEntry } from '../services/api';

const MOOD_LABELS: Record<number, string> = {
  1: 'Very difficult',
  2: 'Difficult',
  3: 'Okay',
  4: 'Good',
  5: 'Very good',
};

const MOOD_EMOJI: Record<number, string> = {
  1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😊',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [loadingMood, setLoadingMood] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
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
      } catch {
        // non-fatal
      } finally {
        setLoadingMood(false);
      }
    }
    fetchMoodData();
  }, []);

  const weeklyCount = recentMoods.length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {getGreeting()}, {user?.name || 'Friend'}
        </h1>
        <p className="text-slate-600 text-sm">
          Welcome back. Take a moment to pause and check in with yourself today.
        </p>
      </div>

      {/* Two Column: Mood + Chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Today's Mood Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              Today's Check-In
            </h2>
            {loadingMood ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : todayMood ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{MOOD_EMOJI[todayMood.moodScore]}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{MOOD_LABELS[todayMood.moodScore]}</p>
                  {todayMood.note && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">"{todayMood.note}"</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">No check-in recorded yet today.</p>
            )}

            {/* Weekly summary */}
            {!loadingMood && (
              <p className="text-xs text-slate-400">
                {weeklyCount > 0
                  ? `${weeklyCount} check-in${weeklyCount === 1 ? '' : 's'} in the last 7 days`
                  : 'No check-ins in the last 7 days'}
              </p>
            )}
          </div>
          <Link
            to="/mood"
            id="link-mood-checkin"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition w-full sm:w-auto mt-2"
          >
            {todayMood ? 'View mood history' : 'Check in now'}
          </Link>
        </div>

        {/* ── Talk to Assistant Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              Talk to someone
            </h2>
            <div>
              <p className="text-xs font-medium text-slate-500">Safe, confidential reflection</p>
              <p className="text-sm text-slate-800 leading-relaxed mt-1">
                I'm here to listen whenever you need a calm, non-judgmental space to reflect.
              </p>
            </div>
          </div>
          <Link
            to="/chat"
            id="link-start-chat"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition w-full sm:w-auto mt-2"
          >
            <span>💬</span>
            <span>Start a conversation</span>
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-slate-100/70 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <span className="text-base select-none">ℹ️</span>
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">MindCare AI is an emotional support companion</p>
          <p className="text-[11px] leading-relaxed">
            If you are experiencing an urgent crisis or distress, please consult a qualified mental health professional or emergency service.
          </p>
        </div>
      </div>
    </div>
  );
}
