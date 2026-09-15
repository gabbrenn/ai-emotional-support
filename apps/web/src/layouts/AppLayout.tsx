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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="font-semibold text-slate-900 tracking-tight">MindCare AI</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 border-r border-slate-200 bg-white p-5 shrink-0 z-20`}
      >
        {/* Brand */}
        <div className="hidden md:flex items-center gap-3 px-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-lg">
            🌱
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-base leading-none">MindCare AI</div>
            <div className="text-[11px] text-slate-500 mt-1">Emotional Support</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 flex-1" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 border-teal-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`
              }
            >
              <span className="text-base leading-none select-none">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
          <div className="px-2">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={isChatRoute
        ? 'flex-1 overflow-hidden flex flex-col'
        : 'flex-1 p-4 sm:p-6 md:p-10 max-w-5xl overflow-y-auto'
      }>
        <Outlet />
      </main>
    </div>
  );
}
