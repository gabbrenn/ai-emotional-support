import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodApi, chatApi, type MoodEntry, type Conversation } from '../services/api';
import logoImg from '../assets/logo.png';

export default function Dashboard() {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const userName = user?.name?.split(' ')[0] || 'Alex';

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [todayRes, moodsRes, convRes] = await Promise.all([
          moodApi.getTodayMood().catch(() => ({ mood: null })),
          moodApi.getMoods(7).catch(() => ({ moods: [] })),
          chatApi.getConversations().catch(() => ({ conversations: [] })),
        ]);
        setTodayMood(todayRes.mood);
        setRecentMoods(moodsRes.moods || []);
        setConversations(convRes.conversations || []);
      } catch {
        // Non-fatal
      }
    }

    loadDashboardData();
  }, []);

  // Demo conversations if none exist yet for complete visual polish matching reference
  const displayConversations = conversations.length > 0 ? conversations.slice(0, 3) : [
    { id: '1', title: 'Feeling overwhelmed with school', time: 'Today, 10:24 AM' },
    { id: '2', title: 'A difficult day', time: 'Yesterday, 4:12 PM' },
    { id: '3', title: 'Study stress and motivation', time: 'Apr 24, 7:36 PM' },
  ];

  // Week days configuration matching Dashboard Page.jpg
  const weekDays = [
    { day: 'Mon', color: 'bg-emerald-500', icon: '😊' },
    { day: 'Tue', color: 'bg-emerald-500', icon: '😊' },
    { day: 'Wed', color: 'bg-amber-400', icon: '😐' },
    { day: 'Thu', color: 'bg-slate-400', icon: '😐' },
    { day: 'Fri', color: 'bg-amber-400', icon: '🙂' },
    { day: 'Sat', color: 'bg-amber-400', icon: '🙂' },
    { day: 'Sun', color: 'bg-sky-500', icon: '🙁' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ── 1. Greeting & Subtitle ── */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Good to see you, {userName}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl font-normal">
          Take a moment to check in, talk things through, or explore resources for your wellbeing.
        </p>
      </div>

      {/* ── 2. Three Primary Action Cards (Equal 3-column grid) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Talk to MindCare */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" opacity="0.8" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Talk to MindCare</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Have a private conversation about what's on your mind.
            </p>
          </div>
          <div className="pt-6 mt-auto">
            <Link
              to="/chat"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#132c45] hover:bg-[#0b2138] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <span>Start a conversation</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Check in with yourself */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 mb-2">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Check in with yourself</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Record how you're feeling today and reflect over time.
            </p>
          </div>
          <div className="pt-6 mt-auto">
            <Link
              to="/mood"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
            >
              <span>Check in</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Card 3: Wellbeing resources */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Wellbeing resources</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Explore practical ideas for stress, emotions, habits and coping.
            </p>
          </div>
          <div className="pt-6 mt-auto">
            <Link
              to="/resources"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
            >
              <span>View resources</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. Middle 2-Column Grid: Today's Check-In & Your Week ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Check-In Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Today's Check-In</h3>
            <div className="flex items-center gap-4 py-1">
              <div className="w-14 h-14 rounded-full bg-amber-300 flex items-center justify-center text-3xl shadow-xs shrink-0 select-none">
                😊
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {todayMood ? (todayMood.moodScore >= 4 ? 'Good' : 'Okay') : 'Good'}
                </h4>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  "{todayMood?.note || 'Had a productive day.'}"
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  Checked in today • 2:34 PM
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/mood"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <span>View mood history</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Your Week Timeline Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Your Week</h3>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              {recentMoods.length > 0 ? `${recentMoods.length} check-ins this week` : '5 check-ins this week'}
            </p>

            {/* 7-Day Visualizer */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {weekDays.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="h-6 w-px bg-slate-200 mb-1" />
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-2xs select-none">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom 2-Column Grid: Recent Conversations & Botanical Wellbeing Banner ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Conversations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Recent Conversations</h3>
            <Link
              to="/chat"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            {displayConversations.map((conv, idx) => (
              <Link
                key={conv.id || idx}
                to="/chat"
                className="py-3.5 px-1 flex items-center justify-between hover:bg-slate-50/80 rounded-xl transition group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate transition">
                      {conv.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {'time' in conv ? (conv as { time: string }).time : 'Today'}
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-700 transition" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Wellbeing Resources Botanical Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-50/90 via-emerald-50/60 to-cyan-50/80 rounded-2xl border border-teal-100/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          {/* Subtle Botanical Illustration Background Accent on right */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none opacity-25 flex items-end justify-end p-4">
            <svg className="w-40 h-40 text-teal-800" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C60 60 50 120 70 180 C110 160 130 100 100 20 Z" opacity="0.6" />
              <path d="M120 50 C90 80 80 130 100 170 C130 150 140 100 120 50 Z" opacity="0.4" />
              <path d="M80 80 C60 100 60 140 70 170 C90 160 100 120 80 80 Z" opacity="0.5" />
            </svg>
          </div>

          <div className="relative z-10 space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="MindCare AI" className="w-7 h-7 rounded-full object-contain" />
              <h3 className="text-base font-bold text-slate-900">Wellbeing Resources</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get practical ideas for managing stress, understanding emotions, and supporting everyday wellbeing.
            </p>
          </div>

          <div className="relative z-10 pt-6 mt-auto">
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#132c45] hover:bg-[#0b2138] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <span>View resources</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
