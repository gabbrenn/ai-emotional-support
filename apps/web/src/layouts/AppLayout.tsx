import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(true);

  const isChatRoute = location.pathname.startsWith('/chat');

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Chat',
      path: '/chat',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: 'Mood',
      path: '/mood',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* ── Mobile Topbar ── */}
      <header className="md:hidden h-14 shrink-0 flex items-center justify-between px-4 bg-[#0b2138] text-white z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="MindCare AI" className="w-8 h-8 rounded-full object-contain" />
          <span className="font-bold text-white tracking-tight text-lg">MindCare AI</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Mobile Drawer Backdrop ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Navigation ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 max-w-[80vw] bg-[#0b2138] text-white z-50 p-6 flex flex-col shadow-2xl md:hidden transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="MindCare AI" className="w-8 h-8 rounded-full object-contain" />
            <span className="font-bold text-white tracking-tight text-lg">MindCare AI</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-slate-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1a3d60] text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <div className="pt-3 mt-3 border-t border-white/10">
              <p className="px-4 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Administration
              </p>
              <NavLink
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1a3d60] text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin Dashboard</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-white/5 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Desktop Fixed Sidebar ── */}
      <aside
        id="desktop-navigation"
        className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 h-screen bg-[#0b2138] text-white z-20 flex-col shrink-0 p-5 select-none"
      >
        <div className="flex items-center gap-3 px-2 py-3 mb-6 shrink-0">
          <img src={logoImg} alt="MindCare AI" className="w-9 h-9 rounded-full object-contain drop-shadow-xs" />
          <span className="text-xl font-bold tracking-tight text-white">MindCare AI</span>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#183d63] text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <div className="pt-3 mt-3 border-t border-white/10">
              <p className="px-4 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Administration
              </p>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#183d63] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin Dashboard</span>
              </NavLink>
            </div>
          )}
        </nav>

        {showEncouragement && (
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 text-white mb-4 shrink-0 transition-all">
            <button
              type="button"
              onClick={() => setShowEncouragement(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs cursor-pointer"
              aria-label="Dismiss encouragement"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-2">
              <img src={logoImg} alt="MindCare AI" className="w-5 h-5 rounded-full object-contain" />
            </div>
            <h4 className="text-xs font-bold text-white tracking-tight">You're doing well</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Small steps make a big difference.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 h-[calc(100dvh-3.5rem)] md:h-screen overflow-hidden bg-[#f8fafc]">
        {/* Top Header Bar (Search Input removed as requested, profile on right) */}
        <header className="hidden md:flex px-6 lg:px-10 py-3.5 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              MindCare Space
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AJ'}
              </div>
              <span className="text-sm font-semibold text-slate-900 hidden sm:inline">
                {user?.name || 'Alex Johnson'}
              </span>
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main
          className={
            isChatRoute
              ? 'flex-1 overflow-hidden flex flex-col p-2 sm:p-4 md:p-6 max-w-5xl w-full mx-auto'
              : 'flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto'
          }
        >
          <Outlet />
        </main>
      </div>

      {/* ── Animated Floating Chat Button (Bottom-right on dashboard and other post-login pages) ── */}
      {!isChatRoute && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <button
            type="button"
            id="floating-chat-button"
            onClick={() => navigate('/chat')}
            aria-label="Direct to chat page"
            className="relative flex items-center gap-3 bg-[#0b2138] hover:bg-[#133355] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-slate-900/30 border border-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            {/* Pulsing glow ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60 blur-xs group-hover:opacity-100 transition duration-300 -z-10 animate-pulse" />

            {/* System Logo */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src={logoImg}
                alt="MindCare AI"
                className="w-full h-full object-contain rounded-full transform group-hover:rotate-12 transition-transform duration-300"
              />
            </div>

            {/* Label (visible on tablet/desktop) */}
            <span className="hidden sm:inline text-sm font-semibold tracking-wide pr-1">
              Chat with AI
            </span>

            {/* Online notification beacon */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0b2138]" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
