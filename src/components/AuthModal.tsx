import React, { useState } from 'react';
import { Mail, User as UserIcon, X, Sparkles, LogIn, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Guest login failed');
      }

      setSuccess('Logged in as Guest successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const body = isSignUp ? { email, name: name || email.split('@')[0] } : { email };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccess(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100">
        {/* Header accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <button
          onClick={onClose}
          className="absolute p-1 text-gray-400 hover:text-gray-600 transition-colors top-4 right-4 rounded-full hover:bg-gray-100"
          id="auth-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {isSignUp ? 'Join Professional PDF' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-gray-500">The all-in-one SaaS PDF powerhouse</p>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">We will auto-create an account if you do not have one.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors rounded-xl shadow-md shadow-blue-200 disabled:opacity-50"
              id="auth-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isSignUp ? 'Create Free Account' : 'Sign In Instantly'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
              <span className="bg-white px-2 text-slate-400">Or use instant access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition-colors shadow-xs"
            id="auth-guest-btn"
          >
            <UserIcon className="w-4 h-4 text-slate-500" />
            Guest Login (4 Operations Limit)
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-xs text-blue-600 hover:underline font-medium"
              id="auth-toggle-mode-btn"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up for Free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
