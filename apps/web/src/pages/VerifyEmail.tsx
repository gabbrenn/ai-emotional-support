import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import loginBg from '../assets/login-bg.png';
import logoImg from '../assets/logo.png';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (token) {
      handleVerify(token);
    } else {
      setStatus('error');
      setMessage('Missing verification token. Please check the link in your email.');
    }
  }, [token]);

  const handleVerify = async (tok: string) => {
    setStatus('verifying');
    setMessage('Verifying your email address...');
    try {
      const res = await authApi.verifyEmail({ token: tok });
      setStatus('success');
      setMessage(res.message || 'Email verified successfully! You can now log in.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Verification failed. The link may be expired or invalid.');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResendStatus('sending');
    try {
      const res = await authApi.resendVerification({ email: resendEmail.trim() });
      setResendStatus('sent');
      setResendMessage(res.message || 'A new verification link has been sent to your email.');
    } catch (err: any) {
      setResendStatus('error');
      setResendMessage(err.message || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-x-hidden">
      {/* Background Image */}
      <img
        src={loginBg}
        alt="Background scenic mountain lake"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none -z-10"
      />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-100 p-8 sm:p-10 text-center my-auto">
        {/* Brand Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shadow-xs">
            <img src={logoImg} alt="MindCare AI" className="w-full h-full object-contain" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Email Verification</h1>

        {status === 'verifying' && (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 text-sm font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <p className="text-slate-700 text-base font-semibold">{message}</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your account is now fully verified. You can log in to begin your emotional wellness sessions.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Go to Login &rarr;
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 space-y-5">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✕
            </div>
            <p className="text-red-700 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
              {message}
            </p>

            <div className="pt-2 text-left border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Need a new verification link?
              </h2>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={resendStatus === 'sending'}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>

              {resendStatus === 'sent' && (
                <p className="text-emerald-700 text-xs font-medium mt-2 bg-emerald-50 p-2.5 rounded-lg">
                  {resendMessage}
                </p>
              )}
              {resendStatus === 'error' && (
                <p className="text-red-600 text-xs font-medium mt-2">
                  {resendMessage}
                </p>
              )}
            </div>

            <div className="pt-3">
              <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
