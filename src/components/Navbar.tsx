'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Icons } from './Icons';

export function Navbar() {
  const { user, isLoggedIn, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle outside click for user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const getDashboardLink = () => {
    if (user?.role === 'BRAND') return '/dashboard/brand';
    if (user?.role === 'INFLUENCER' || user?.role === 'AI_CREATOR') return '/dashboard/creator';
    if (user?.role === 'ADMIN') return '/dashboard/admin';
    return '/dashboard/brand';
  };

  const getRoleBadge = () => {
    if (user?.role === 'BRAND') return 'Brand';
    if (user?.role === 'AI_CREATOR') return 'AI Studio';
    if (user?.role === 'INFLUENCER') return 'Creator';
    if (user?.role === 'ADMIN') return 'Admin';
    return 'Member';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Icons.Sparkles className="w-4 h-4 text-zinc-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-zinc-950 flex items-center">
                Flowty<span className="text-indigo-600">.</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-zinc-600 uppercase -mt-1">
                Creator &amp; Escrow
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
            <Link 
              href="/creators" 
              className="hover:text-zinc-950 transition-colors"
            >
              Explore Creators
            </Link>
            
            <Link 
              href="/ai-creators" 
              className="hover:text-zinc-950 transition-colors flex items-center gap-1.5"
            >
              <span>AI Studios</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                AI
              </span>
            </Link>

            <Link 
              href="/dashboard/brand" 
              className="hover:text-zinc-950 transition-colors"
            >
              Brand Escrow
            </Link>

            <Link 
              href="/dashboard/creator" 
              className="hover:text-zinc-950 transition-colors"
            >
              Creator Payouts
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200/80 text-xs font-medium text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PayU Escrow</span>
            </div>

            {isLoggedIn ? (
              /* User is Logged In */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200/80 transition-all text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.avatarUrl || user?.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-950 line-clamp-1 max-w-[100px]">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-600 uppercase -mt-0.5">
                      {getRoleBadge()}
                    </span>
                  </div>
                  <Icons.ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200/90 shadow-premium py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-950 truncate">{user?.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {getRoleBadge()}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        Dashboard &amp; Escrow
                      </Link>
                      <Link
                        href="/dashboard/creator"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        UPI Payout Settings
                      </Link>
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                      >
                        Admin Portal
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User is NOT Logged In */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 shadow-xs hover:shadow transition-all flex items-center gap-1.5"
                >
                  <span>Create Account</span>
                  <Icons.ArrowRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!isLoggedIn ? (
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-950 shadow-xs"
              >
                Sign Up
              </Link>
            ) : (
              <Link
                href={getDashboardLink()}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-800"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200/80"
              aria-label="Toggle Menu"
            >
              <Icons.Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-zinc-200/70 space-y-1 bg-white/95 backdrop-blur-lg rounded-b-2xl px-2">
            <Link
              href="/creators"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Explore Creators
            </Link>
            <Link
              href="/ai-creators"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-50 flex items-center justify-between"
            >
              <span>AI Studios</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                AI
              </span>
            </Link>
            <Link
              href="/dashboard/brand"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Brand Dashboard
            </Link>
            <Link
              href="/dashboard/creator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Creator Payouts
            </Link>

            <div className="pt-2 border-t border-zinc-100">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Sign Out ({user?.name})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-800"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 rounded-xl text-xs font-semibold bg-zinc-950 text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
