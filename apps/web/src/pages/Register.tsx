import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import loginBg from '../assets/login-bg.png';
import logoImg from '../assets/logo.png';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setIsRegistered(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(null);
    try {
      const res = await authApi.resendVerification({ email: email.trim() });
      setResendSuccess(res.message || 'Verification link resent to your email!');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-x-hidden">
      {/* ── Full Screen Background Image (covers entire page, zero green color) ── */}
      <img
        src={loginBg}
        alt="Serene mountain lake reflection"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none -z-10"
      />

      {/* ── Main Responsive Grid / Container ── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-6">
        {/* Left Side: Branding & Mission */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 px-2 sm:px-6 select-none">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="MindCare AI Logo"
              className="w-12 h-12 rounded-full object-contain drop-shadow-md"
            />
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs">
              MindCare AI
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] tracking-tight max-w-lg drop-shadow-xs">
            Create your private space for reflection and support.
          </h1>

          <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-md font-medium drop-shadow-xs">
            Begin your journey towards emotional balance. Talk through thoughts freely in a safe and supportive space.
          </p>
        </div>

        {/* Right Side: Floating Register Card (Does NOT touch top or bottom) */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-100 p-7 sm:p-10 my-auto transition-all">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="lg:hidden flex items-center gap-2">
                <img
                  src={logoImg}
                  alt="MindCare AI Logo"
                  className="w-8 h-8 rounded-full object-contain"
                />
                <span className="text-lg font-bold text-slate-900">MindCare AI</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 ml-auto">
                Already have an account?{' '}
                <Link
                  to="/login"
                  id="link-login"
                  className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {isRegistered ? (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <span className="text-2xl">✉</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Verify your email
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We've sent a verification link to <strong className="text-slate-900">{email}</strong>.
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-left">
                    Before logging in, please check your inbox and click the link to activate your account. If you don't see it, check your spam or promotions folder.
                  </p>
                </div>

                {resendSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl text-left">
                    {resendSuccess}
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl text-left">
                    {error}
                  </div>
                )}

                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152e4d] text-white font-semibold text-sm transition-all shadow-md shadow-slate-900/10 cursor-pointer"
                  >
                    Go to Login &rarr;
                  </button>

                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResend}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending link...' : 'Resend verification email'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 mb-5">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Create an account
                  </h2>
                  <p className="text-sm text-slate-500">
                    Join MindCare AI and begin your personal journey today.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
                  >
                    <span className="text-base leading-none select-none pt-0.5" aria-hidden="true">⚠️</span>
                    <span className="flex-1 font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-1">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.6"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.6"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.6"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.6"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.6"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.6"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-xs"
                  />
                </div>
              </div>

                <button
                  type="submit"
                  id="btn-register-submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152e4d] active:bg-[#0f2238] disabled:bg-slate-400 text-white font-semibold text-base transition-all duration-200 shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2"
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>
                </form>
              </>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                MindCare AI provides compassionate emotional support. Your conversations remain confidential and protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
