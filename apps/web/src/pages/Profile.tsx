import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // ─── Personal Information State ──────────────────────────────────────────
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Sync name when user object changes
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // ─── Change Password State ───────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setProfileError('Name cannot be empty.');
      return;
    }

    if (trimmedName.length > 100) {
      setProfileError('Name cannot exceed 100 characters.');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await authApi.updateProfile({ name: trimmedName });
      updateUser(response.user);
      setName(response.user.name);
      setProfileSuccess('Your profile has been updated.');
    } catch (err: unknown) {
      const customErr = err as { message?: string };
      setProfileError(customErr.message || 'Failed to update profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword.length > 128) {
      setPasswordError('Password cannot exceed 128 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(res.message || 'Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const customErr = err as { message?: string };
      setPasswordError(customErr.message || 'Failed to change password. Please check your credentials.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile &amp; Account
        </h1>
        <p className="text-slate-600 text-sm">
          Manage your account information and security settings.
        </p>
      </header>

      {/* Section 1: Personal Information */}
      <section
        aria-labelledby="personal-info-heading"
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h2 id="personal-info-heading" className="text-lg font-semibold text-slate-900">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your public display name.
          </p>
        </div>

        {profileSuccess && (
          <div
            role="status"
            className="p-3.5 text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2"
          >
            <span>✓</span>
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div
            role="alert"
            className="p-3.5 text-sm bg-rose-50 text-rose-800 border border-rose-200 rounded-lg flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              disabled={profileLoading}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent disabled:opacity-60 disabled:bg-slate-50 transition"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed select-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Email address cannot be changed.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="save-profile-btn"
              type="submit"
              disabled={profileLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {profileLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Section 2: Change Password */}
      <section
        aria-labelledby="change-password-heading"
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h2 id="change-password-heading" className="text-lg font-semibold text-slate-900">
            Change Password
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ensure your account is protected with a secure password.
          </p>
        </div>

        {passwordSuccess && (
          <div
            role="status"
            className="p-3.5 text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2"
          >
            <span>✓</span>
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div
            role="alert"
            className="p-3.5 text-sm bg-rose-50 text-rose-800 border border-rose-200 rounded-lg flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current password
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordLoading}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 pr-14 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent disabled:opacity-60 disabled:bg-slate-50 transition"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                maxLength={128}
                disabled={passwordLoading}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 pr-14 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent disabled:opacity-60 disabled:bg-slate-50 transition"
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                maxLength={128}
                disabled={passwordLoading}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 pr-14 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent disabled:opacity-60 disabled:bg-slate-50 transition"
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="change-password-btn"
              type="submit"
              disabled={passwordLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {passwordLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>{passwordLoading ? 'Updating...' : 'Change Password'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Section 3: Privacy & Safety Information */}
      <section
        aria-labelledby="privacy-heading"
        className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3"
      >
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <span>🛡️</span>
          <h2 id="privacy-heading">Your privacy</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          MindCare AI is designed to provide a private space for reflection and emotional support.
          Avoid sharing passwords, financial information, or other highly sensitive personal information in chat.
        </p>
        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-2.5">
          MindCare AI is not a replacement for qualified professional care or emergency services. If you are experiencing a crisis, please use the 24/7 hotlines on the Resources page.
        </p>
      </section>

      {/* Section 4: Account & Log out */}
      <section
        aria-labelledby="account-heading"
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
      >
        <div className="border-b border-slate-100 pb-3">
          <h2 id="account-heading" className="text-lg font-semibold text-slate-900">
            Account
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="text-sm font-medium text-slate-800">{user?.email}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              Active Account
            </p>
          </div>

          <button
            id="profile-logout-btn"
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto px-4 py-2 rounded-lg text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition cursor-pointer flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Log out</span>
          </button>
        </div>
      </section>
    </div>
  );
}
