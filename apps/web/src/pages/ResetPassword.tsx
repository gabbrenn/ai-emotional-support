import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import loginBg from '../assets/login-bg.png';
import logoImg from '../assets/logo.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Forgot password state (when no token in URL)
  const [email, setEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Reset password state (when token is in URL)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!email.trim()) {
      setForgotError('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to request password reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    if (!token) {
      setResetError('Missing reset token');
      return;
    }

    setResetLoading(true);
    try {
      await authApi.resetPassword({ token, password: newPassword });
      setResetSuccess(true);
    } catch (err: any) {
      setResetError(err.message || 'Failed to reset password. The link may be expired.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-x-hidden">
      {/* Background Image */}
      <img
        src={loginBg}
        alt="Scenic mountain lake background"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none -z-10"
      />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 p-8 sm:p-10 my-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logoImg} alt="MindCare AI" className="w-10 h-10 rounded-full object-contain drop-shadow-xs" />
          <span className="text-2xl font-black text-slate-900 tracking-tight">MindCare AI</span>
        </div>

        {/* ── Mode 1: Set New Password (Token is present) ── */}
        {token ? (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">
              Create New Password
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm text-center mb-6">
              Please enter and confirm your new secure password.
            </p>

            {resetSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h2 className="text-base font-bold text-slate-900">Password Reset Complete</h2>
                <p className="text-slate-600 text-xs">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Sign In &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {resetError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {resetError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {resetLoading ? 'Resetting...' : 'Save New Password'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ── Mode 2: Request Password Reset Link (No token in URL) ── */
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">
              Forgot Password
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm text-center mb-6">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            {forgotSent ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✉
                </div>
                <h2 className="text-base font-bold text-slate-900">Check Your Email</h2>
                <p className="text-slate-600 text-xs leading-relaxed">
                  If an account exists for <strong className="text-slate-900">{email}</strong>, a password reset link has been sent. Please check your inbox or spam folder.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {forgotError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {forgotError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
