import { useState, useEffect, useCallback, useId } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import type { AdminStats, AdminUser, UserRole } from '@ai-esa/shared';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const searchInputId = useId();

  // State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  const fetchAdminData = useCallback(async (search?: string) => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [statsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(search),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      adminApi
        .getUsers(searchQuery)
        .then((res) => setUsers(res.users))
        .catch(() => {
          // If search fails, keep previous results or show error
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRoleChange = async (targetUser: AdminUser) => {
    if (currentUser?.id === targetUser.id) {
      setActionMessage({
        type: 'error',
        text: 'Administrators cannot change their own admin role.',
      });
      return;
    }

    const newRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMessage =
      newRole === 'admin'
        ? `Grant administrator access to ${targetUser.name}?`
        : `Demote ${targetUser.name} to standard user?`;

    if (!window.confirm(confirmMessage)) return;

    setActionInProgress(targetUser.id);
    setActionMessage(null);

    try {
      const res = await adminApi.updateRole(targetUser.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: res.user.role } : u))
      );
      setActionMessage({
        type: 'success',
        text: `Successfully updated ${targetUser.name}'s role to ${newRole}.`,
      });
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err?.message || 'Failed to update user role.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleStatusToggle = async (targetUser: AdminUser) => {
    if (currentUser?.id === targetUser.id && targetUser.isActive) {
      setActionMessage({
        type: 'error',
        text: 'Administrators cannot deactivate their own account.',
      });
      return;
    }

    const nextStatus = !targetUser.isActive;
    const confirmMessage = nextStatus
      ? `Reactivate account for ${targetUser.name}?`
      : `Deactivate account for ${targetUser.name}? They will be unable to log in.`;

    if (!window.confirm(confirmMessage)) return;

    setActionInProgress(targetUser.id);
    setActionMessage(null);

    try {
      const res = await adminApi.updateStatus(targetUser.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: res.user.isActive } : u))
      );
      setActionMessage({
        type: 'success',
        text: `Account for ${targetUser.name} has been ${nextStatus ? 'activated' : 'deactivated'}.`,
      });
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err?.message || 'Failed to update user account status.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 pb-12 text-slate-800">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Administration
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-normal">
            Monitor MindCare AI activity and manage user accounts.
          </p>
        </div>

        {/* Reassurance badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold self-start sm:self-auto">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Privacy Shield Active</span>
        </div>
      </div>

      {/* ── Privacy Notice Banner ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="text-sm">
          <h2 className="font-semibold text-slate-900">User Privacy is Strictly Guaranteed</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 leading-relaxed">
            MindCare AI administrators can only view aggregate counts and safe account credentials.
            Individual chat messages, AI responses, and mood notes remain completely confidential and encrypted.
          </p>
        </div>
      </div>

      {/* ── Action Notification ── */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold underline ml-4 hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Error State ── */}
      {hasError ? (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">We couldn't load administration data. Please try again.</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The server may be starting up or experienced an intermittent communication issue.
          </p>
          <button
            type="button"
            onClick={() => fetchAdminData(searchQuery)}
            className="px-5 py-2.5 rounded-xl bg-[#0b2138] hover:bg-[#132c45] text-white text-sm font-semibold transition cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <>
          {/* ── 2. Statistics Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Users */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Users
                </span>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {isLoading ? '—' : stats?.totalUsers ?? 0}
              </div>
              <p className="text-xs text-slate-400 mt-1">Registered accounts</p>
            </div>

            {/* Card 2: Total Conversations */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Conversations
                </span>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {isLoading ? '—' : stats?.totalConversations ?? 0}
              </div>
              <p className="text-xs text-slate-400 mt-1">Private support sessions</p>
            </div>

            {/* Card 3: Mood Check-ins */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mood Check-ins
                </span>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {isLoading ? '—' : stats?.totalMoodCheckins ?? 0}
              </div>
              <p className="text-xs text-slate-400 mt-1">Daily self-reflections</p>
            </div>

            {/* Card 4: New Users This Week */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  New Users
                </span>
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {isLoading ? '—' : stats?.newUsersThisWeek ?? 0}
              </div>
              <p className="text-xs text-slate-400 mt-1">Joined this week</p>
            </div>
          </div>

          {/* ── 3. User Registration Summary ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">User Registration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">New users today</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {isLoading ? '—' : stats?.newUsersToday ?? 0}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">New users this week</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {isLoading ? '—' : stats?.newUsersThisWeek ?? 0}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">New users this month</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {isLoading ? '—' : stats?.newUsersThisMonth ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* ── 4. Users Table Section ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Users</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Account directory with roles and account statuses
                </p>
              </div>

              {/* Search Field */}
              <div className="relative w-full sm:w-72">
                <label htmlFor={searchInputId} className="sr-only">
                  Search users
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b2138] focus:bg-white transition"
                />
              </div>
            </div>

            {/* Table or Empty State */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent mb-2" />
                <p>Loading accounts...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                <p className="font-semibold text-slate-700">
                  {searchQuery ? 'No users match your search.' : 'No users found.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-blue-600 hover:underline mt-2"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/70">
                    <tr>
                      <th className="py-3.5 px-6">Name</th>
                      <th className="py-3.5 px-6">Email</th>
                      <th className="py-3.5 px-6">Role</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Joined</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => {
                      const isSelf = currentUser?.id === u.id;
                      const inProgress = actionInProgress === u.id;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-semibold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {u.name.slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate">{u.name}</p>
                                {isSelf && (
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                            {u.email}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200/60'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                u.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              {u.isActive ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 text-xs">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                            {/* Role toggle button */}
                            <button
                              type="button"
                              disabled={isSelf || inProgress}
                              onClick={() => handleRoleChange(u)}
                              title={
                                isSelf
                                  ? 'Cannot change your own role'
                                  : u.role === 'admin'
                                  ? 'Demote to user'
                                  : 'Promote to admin'
                              }
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                                isSelf
                                  ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                                  : u.role === 'admin'
                                  ? 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100 cursor-pointer'
                                  : 'border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer'
                              }`}
                            >
                              {inProgress
                                ? '...'
                                : u.role === 'admin'
                                ? 'Demote'
                                : 'Make Admin'}
                            </button>

                            {/* Status toggle button */}
                            <button
                              type="button"
                              disabled={isSelf || inProgress}
                              onClick={() => handleStatusToggle(u)}
                              title={
                                isSelf
                                  ? 'Cannot deactivate your own account'
                                  : u.isActive
                                  ? 'Deactivate account'
                                  : 'Activate account'
                              }
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                                isSelf
                                  ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                                  : u.isActive
                                  ? 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer'
                                  : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
                              }`}
                            >
                              {inProgress
                                ? '...'
                                : u.isActive
                                ? 'Deactivate'
                                : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
