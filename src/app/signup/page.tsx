'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Icons } from '@/components/Icons';
import { UPI_REGEX } from '@/lib/security';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'creator' ? 'CREATOR' : 'BRAND';

  const [accountType, setAccountType] = useState<'BRAND' | 'CREATOR'>(initialType);
  const [creatorType, setCreatorType] = useState<'INFLUENCER' | 'AI_CREATOR'>('INFLUENCER');

  // Shared Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');

  // Brand-Specific Fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Tech & Software');

  // Creator-Specific Fields
  const [displayName, setDisplayName] = useState('');
  const [niche, setNiche] = useState('Tech & Gadgets');
  const [upiId, setUpiId] = useState('');
  const [startingPrice, setStartingPrice] = useState('15000');

  // UI State
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Strength Calculation
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(password);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-rose-500', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'];

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (accountType === 'CREATOR') {
      if (!upiId || !UPI_REGEX.test(upiId.trim())) {
        setErrorMsg('Please provide a valid UPI ID (e.g. name@okhdfcbank) for instant escrow payouts.');
        return;
      }
    }

    setLoading(true);

    try {
      const payload: any = {
        accountType,
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
        city
      };

      if (accountType === 'BRAND') {
        payload.companyName = companyName.trim();
        payload.industry = industry;
      } else {
        payload.displayName = displayName.trim();
        payload.creatorType = creatorType;
        payload.niche = niche;
        payload.upiId = upiId.trim();
        payload.startingPrice = startingPrice ? Number(startingPrice) : 15000;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setSuccessMsg('Account created successfully! Signing you in...');

      // Auto sign in with credentials
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: payload.email,
        password
      });

      if (signInResult?.error) {
        // Fallback redirect to login
        router.push(`/login?registered=true&email=${encodeURIComponent(payload.email)}`);
      } else {
        const dest = accountType === 'BRAND' ? '/dashboard/brand' : '/dashboard/creator';
        router.push(dest);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setErrorMsg('');

    try {
      // Trigger Google direct signup/sign-in
      const simulatedGoogleEmail = `${(accountType === 'BRAND' ? (companyName || 'brand') : (displayName || 'creator'))
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')}_user@gmail.com`;

      const res = await fetch('/api/auth/google-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || simulatedGoogleEmail,
          name: (accountType === 'BRAND' ? companyName : displayName) || (accountType === 'BRAND' ? 'Nexus Brand Partner' : 'Creative Studio Director'),
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          accountType,
          creatorType,
          city,
          niche,
          upiId: upiId || (accountType === 'CREATOR' ? 'creator@okaxis' : undefined)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      setSuccessMsg('Google account linked! Redirecting to dashboard...');

      const target = accountType === 'BRAND' ? '/dashboard/brand' : '/dashboard/creator';
      setTimeout(() => {
        router.push(target);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold border border-zinc-200/80 mb-1">
            <Icons.Sparkles className="w-3.5 h-3.5 text-zinc-900" />
            <span>Join Flowty Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Choose your account role to hire top talent or showcase your creator profile with guaranteed PayU escrow.
          </p>
        </div>

        {/* Account Role Selector Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => setAccountType('BRAND')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              accountType === 'BRAND'
                ? 'bg-white border-zinc-950 shadow-premium ring-1 ring-zinc-950'
                : 'bg-white/80 border-zinc-200/80 hover:border-zinc-300 shadow-subtle'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                accountType === 'BRAND' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'
              }`}>
                <Icons.Building2 className="w-4 h-4" />
              </div>
              {accountType === 'BRAND' && (
                <span className="w-2 h-2 rounded-full bg-zinc-950" />
              )}
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Brand / Agency</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
              Hire influencers &amp; AI studios with PayU escrow protection
            </p>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('CREATOR')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              accountType === 'CREATOR'
                ? 'bg-white border-purple-800 shadow-premium ring-1 ring-purple-800'
                : 'bg-white/80 border-zinc-200/80 hover:border-zinc-300 shadow-subtle'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                accountType === 'CREATOR' ? 'bg-purple-800 text-white' : 'bg-zinc-100 text-zinc-700'
              }`}>
                <Icons.Sparkles className="w-4 h-4" />
              </div>
              {accountType === 'CREATOR' && (
                <span className="w-2 h-2 rounded-full bg-purple-800" />
              )}
            </div>
            <h3 className="text-sm font-bold text-zinc-950">Creator / Studio</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
              Accept jobs, create content &amp; receive instant UPI settlements
            </p>
          </button>
        </div>

        {/* Main Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-subtle space-y-6">
          {/* Google Auth Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full py-3 px-4 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-subtle hover:border-zinc-300 disabled:opacity-60"
            >
              <Icons.Google className="w-4 h-4" />
              <span>
                {googleLoading ? 'Connecting with Google...' : `Continue with Google as ${accountType === 'BRAND' ? 'Brand' : 'Creator'}`}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-100" />
            <span className="absolute bg-white px-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
              or with password
            </span>
          </div>

          {/* Feedback Alerts */}
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* BRAND ACCOUNT SPECIFIC FIELDS */}
            {accountType === 'BRAND' ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Company / Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations, Nike India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-subtle"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Industry / Sector
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-xs font-medium text-zinc-800 outline-none focus:bg-white cursor-pointer"
                    >
                      {['Tech & Software', 'Fashion & Apparel', 'Health & Wellness', 'Fintech & Banking', 'Food & Beverages', 'Gaming & Entertainment', 'E-commerce'].map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Headquarters City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-xs font-medium text-zinc-800 outline-none focus:bg-white cursor-pointer"
                    >
                      {['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'London'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              /* CREATOR ACCOUNT SPECIFIC FIELDS */
              <>
                {/* Creator Type Sub-toggle (Influencer vs AI Studio) */}
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                    Creator Profile Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-100 border border-zinc-200/70">
                    <button
                      type="button"
                      onClick={() => setCreatorType('INFLUENCER')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        creatorType === 'INFLUENCER'
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      <Icons.Video className="w-3.5 h-3.5" />
                      <span>Human Influencer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatorType('AI_CREATOR')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        creatorType === 'AI_CREATOR'
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      <Icons.Bot className="w-3.5 h-3.5" />
                      <span>AI Video Studio</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    {creatorType === 'AI_CREATOR' ? 'AI Studio Name' : 'Creator Display Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={creatorType === 'AI_CREATOR' ? 'e.g. Synthetix AI Media' : 'e.g. Priya Kapoor'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-subtle"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      Primary Niche
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-xs font-medium text-zinc-800 outline-none focus:bg-white cursor-pointer"
                    >
                      {['Tech & Gadgets', 'Fashion & Lifestyle', 'Fitness & Wellness', 'Food & Culinary', 'Finance & Crypto', 'AI Video & VFX'].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">
                      City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-xs font-medium text-zinc-800 outline-none focus:bg-white cursor-pointer"
                    >
                      {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'London'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Creator UPI ID for instant settlements */}
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    UPI ID for Escrow Payouts <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. yourname@okhdfcbank, studio@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-sm font-mono text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-subtle"
                    />
                    {upiId && UPI_REGEX.test(upiId.trim()) && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                        <Icons.Check className="w-3.5 h-3.5" />
                        Valid
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-600 block mt-1">
                    Escrow payouts release instantly to this UPI ID upon brand deliverable approval.
                  </span>
                </div>
              </>
            )}

            {/* SHARED FIELDS: EMAIL & PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                {accountType === 'BRAND' ? 'Official Work Email' : 'Professional Email'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all shadow-subtle"
              />
            </div>

            {/* Password with Strength Indicator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                {password && (
                  <span className="text-[10px] font-bold text-zinc-500">
                    Strength: {strengthLabels[passwordStrength]}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 characters"
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

              {/* Password strength meter bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-full flex-1 rounded-full transition-all ${
                          passwordStrength >= lvl ? strengthColors[passwordStrength] : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/80 border text-sm text-zinc-900 outline-none focus:bg-white transition-all shadow-subtle ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-rose-400 focus:border-rose-600'
                    : 'border-zinc-200/90 focus:border-zinc-900'
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <span className="text-[10px] text-rose-500 block mt-1">Passwords do not match</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white shadow-xs transition-all flex items-center justify-center gap-2 ${
                  accountType === 'CREATOR' && creatorType === 'AI_CREATOR'
                    ? 'bg-purple-800 hover:bg-purple-900'
                    : 'bg-zinc-950 hover:bg-zinc-800'
                } disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create {accountType === 'BRAND' ? 'Brand' : 'Creator'} Account</span>
                    <Icons.ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Terms & Sign In Link */}
          <div className="pt-4 border-t border-zinc-100 text-center space-y-2 text-xs text-zinc-500">
            <p>
              By creating an account, you agree to Flowty&apos;s{' '}
              <span className="text-zinc-900 underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-zinc-900 underline cursor-pointer">PayU Escrow Rules</span>.
            </p>
            <p className="text-zinc-600 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-zinc-950 font-bold underline hover:text-indigo-600">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
