'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Icons } from '@/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const isRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(isRegistered ? 'Account created! Please sign in with your password.' : '');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password
      });

      if (res?.error) {
        throw new Error(res.error || 'Invalid email or password.');
      }

      setSuccessMsg('Welcome back! Loading your dashboard...');

      // Check user role from API to determine destination
      const checkRes = await fetch(`/api/auth/session`);
      const session = await checkRes.json();
      const role = session?.user?.role;

      if (role === 'BRAND') {
        router.push('/dashboard/brand');
      } else if (role === 'INFLUENCER' || role === 'AI_CREATOR') {
        router.push('/dashboard/creator');
      } else if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg('');

    try {
      // 1-click Google authentication
      const res = await fetch('/api/auth/google-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'alex.brand@gmail.com',
          name: 'Alex Brand Partner',
          accountType: 'BRAND'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google sign-in failed.');
      }

      setSuccessMsg('Signed in with Google! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard/brand');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setErrorMsg('');
    setSuccessMsg(`Filled ${demoRole} credentials (Password: Password@123)`);
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold border border-zinc-200/80 mb-1">
            <Icons.Lock className="w-3.5 h-3.5 text-zinc-900" />
            <span>Secure Authentication</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
            Welcome to Flowty
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Sign in to access your campaigns, creator escrow, and settlements.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-subtle space-y-6">
          {/* Google Auth Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full py-3 px-4 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-subtle hover:border-zinc-300 disabled:opacity-60"
            >
              <Icons.Google className="w-4 h-4" />
              <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-100" />
            <span className="absolute bg-white px-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
              or email &amp; password
            </span>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2">
              <Icons.AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-start gap-2">
              <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-subtle"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <span className="text-[11px] text-zinc-500 hover:text-zinc-900 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-subtle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-zinc-950 hover:bg-zinc-800 shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <Icons.ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Logins Bar */}
          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 block">
              Quick Test Sign In:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('brand@acmemarketing.com', 'Brand')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors"
              >
                🏢 Brand Account
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('aarav@flowty.com', 'Creator')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors"
              >
                ✨ Creator Account
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('neura@flowty.com', 'AI Studio')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors border border-purple-200/60"
              >
                ⚡ AI Studio
              </button>
            </div>
          </div>

          {/* Footer Link to Signup */}
          <div className="pt-2 text-center text-xs text-zinc-500">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/signup" className="text-zinc-950 font-bold underline hover:text-indigo-600">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
