'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreatorItem } from '@/lib/types';
import { FilterBar, FilterState } from '@/components/FilterBar';
import { CreatorCard } from '@/components/CreatorCard';
import { Icons } from '@/components/Icons';
import { AiCreatorBadge } from '@/components/AiCreatorBadge';

export default function HomePage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);

  const initialFilters: FilterState = {
    search: '',
    type: 'ALL',
    city: 'ALL',
    niche: 'ALL',
    followerRange: 'ALL',
    budgetRange: 'ALL',
    genderFocus: 'ALL',
    dominantAge: 'ALL'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const fetchCreators = async (filterQuery: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterQuery.search) params.set('search', filterQuery.search);
      if (filterQuery.type !== 'ALL') params.set('type', filterQuery.type);
      if (filterQuery.city !== 'ALL') params.set('city', filterQuery.city);
      if (filterQuery.niche !== 'ALL') params.set('niche', filterQuery.niche);
      if (filterQuery.genderFocus !== 'ALL') params.set('genderFocus', filterQuery.genderFocus);
      if (filterQuery.dominantAge !== 'ALL') params.set('dominantAge', filterQuery.dominantAge);

      if (filterQuery.followerRange === 'NANO') {
        params.set('minFollowers', '1000');
        params.set('maxFollowers', '20000');
      } else if (filterQuery.followerRange === 'MICRO') {
        params.set('minFollowers', '20000');
        params.set('maxFollowers', '100000');
      } else if (filterQuery.followerRange === 'MID') {
        params.set('minFollowers', '100000');
        params.set('maxFollowers', '500000');
      } else if (filterQuery.followerRange === 'MACRO') {
        params.set('minFollowers', '500000');
      }

      if (filterQuery.budgetRange === 'TIER_1') {
        params.set('maxPrice', '20000');
      } else if (filterQuery.budgetRange === 'TIER_2') {
        params.set('minPrice', '20000');
        params.set('maxPrice', '50000');
      } else if (filterQuery.budgetRange === 'TIER_3') {
        params.set('minPrice', '50000');
        params.set('maxPrice', '100000');
      } else if (filterQuery.budgetRange === 'TIER_4') {
        params.set('minPrice', '100000');
      }

      const res = await fetch(`/api/creators?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCreators(data.creators);
      }
    } catch (err) {
      console.error('Failed to fetch creators', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators(filters);
  }, [filters]);

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/70 bg-gradient-to-b from-white via-[#fafafa] to-[#fbfbfa]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.06),transparent)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-700 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PayU Escrow Protected • Instant UPI Creator Payouts</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
            Hire Top Creators &amp;{' '}
            <span className="ai-gradient-text">AI Video Studios</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            Precision discovery by city, audience demographics, follower tiers, and budget. Book with confidence using secured PayU escrow.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#discovery-engine"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs hover:shadow transition-all flex items-center gap-2"
            >
              <Icons.Search className="w-4 h-4 text-zinc-400" />
              <span>Explore Marketplace</span>
            </a>

            <button
              onClick={() => {
                setFilters({ ...filters, type: 'AI_CREATOR' });
                document.getElementById('discovery-engine')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-purple-800 bg-purple-50/80 border border-purple-200/70 hover:bg-purple-100/70 transition-all flex items-center gap-2 shadow-subtle"
            >
              <Icons.Bot className="w-4 h-4 text-purple-600" />
              <span>Browse AI Studios</span>
            </button>

            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-xl font-medium text-sm text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200/80 transition-all shadow-subtle"
            >
              Join as Creator
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-subtle text-left">
              <span className="text-2xl font-bold text-zinc-950 block tracking-tight">4,200+</span>
              <span className="text-xs text-zinc-500 font-medium">Verified Creators</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-subtle text-left">
              <span className="text-2xl font-bold text-zinc-950 block tracking-tight">₹18.4 Cr+</span>
              <span className="text-xs text-zinc-500 font-medium">Escrow Volume</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-subtle text-left">
              <span className="text-2xl font-bold text-purple-800 block tracking-tight">350+</span>
              <span className="text-xs text-zinc-500 font-medium">AI Studios</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-subtle text-left">
              <span className="text-2xl font-bold text-emerald-600 block tracking-tight">100%</span>
              <span className="text-xs text-zinc-500 font-medium">Direct UPI Payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Creator Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-white border border-purple-200/70 shadow-subtle overflow-hidden">
          {/* Subtle Ambient Light in Card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <AiCreatorBadge studioName="Dedicated AI Production Profiles" size="md" />
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Generative <span className="ai-gradient-text">AI Video Production</span> on Demand
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Produce photorealistic virtual spokespersons, physics-accurate product CGI, and localized multilingual ads without sets or physical crews. Book verified prompt directors and generative video artists.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Runway Gen-3', 'Kling AI 1.5', 'Midjourney v6.1', 'ElevenLabs Voice', 'Luma Dream Machine', 'Commercial Rights'].map(tool => (
                  <span key={tool} className="text-xs px-2.5 py-1 rounded-lg bg-zinc-50 text-zinc-700 border border-zinc-200/70 font-mono font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto flex-shrink-0">
              <Link
                href="/ai-creators"
                className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-purple-700 hover:bg-purple-800 shadow-xs text-center transition-all flex items-center justify-center gap-2"
              >
                <Icons.Bot className="w-4 h-4" />
                <span>Explore AI Studios Gallery</span>
              </Link>
              <Link
                href="/onboarding?type=AI_CREATOR"
                className="px-6 py-3 rounded-xl font-medium text-xs text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200/80 text-center transition-all shadow-subtle"
              >
                Join as AI Video Creator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery & Filtering Engine Section */}
      <section id="discovery-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-zinc-600 tracking-wider uppercase">
              Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Verified Creators &amp; Studios
            </h2>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-600 font-medium mr-1">Quick:</span>
            {['Mumbai', 'Bangalore', 'Delhi'].map(city => (
              <button
                key={city}
                onClick={() => setFilters({ ...filters, city })}
                className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                  filters.city === city
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white border-zinc-200/80 text-zinc-700 hover:border-zinc-400 shadow-subtle'
                }`}
              >
                {city}
              </button>
            ))}
            <button
              onClick={() => setFilters({ ...filters, niche: 'Tech & Gadgets' })}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                filters.niche === 'Tech & Gadgets'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white border-zinc-200/80 text-zinc-700 hover:border-zinc-400 shadow-subtle'
              }`}
            >
              Tech
            </button>
            <button
              onClick={() => setFilters({ ...filters, type: 'AI_CREATOR' })}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                filters.type === 'AI_CREATOR'
                  ? 'bg-purple-700 text-white border-purple-700'
                  : 'bg-purple-50 text-purple-700 border-purple-200/70 hover:bg-purple-100/70'
              }`}
            >
              AI Studios
            </button>
          </div>
        </div>

        {/* The FilterBar Component */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          totalResults={creators.length}
        />

        {/* Creators Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-medium">Filtering verified creators...</p>
          </div>
        ) : creators.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-white border border-zinc-200/80 space-y-4 shadow-subtle">
            <Icons.Filter className="w-9 h-9 text-zinc-300 mx-auto" />
            <h3 className="text-base font-bold text-zinc-950">No creators found matching criteria</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your city, follower tiers, or category filters to broaden your search.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-zinc-500 md:hidden mb-2 px-1">
              <span className="flex items-center gap-1 font-medium">
                <span>Swipe cards horizontally</span>
                <span>&rarr;</span>
              </span>
              <span className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-semibold">
                {creators.length} available
              </span>
            </div>
            <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-5 md:pb-0 gap-4 sm:gap-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:grid-cols-2 lg:grid-cols-3">
              {creators.map((creator) => (
                <div key={creator.id} className="w-[84vw] sm:w-[350px] md:w-auto shrink-0 snap-center md:snap-align-none flex flex-col">
                  <CreatorCard creator={creator} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Escrow & PayU Workflow Section */}
      <section id="how-escrow-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/80 shadow-subtle space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-semibold text-zinc-600 tracking-wider uppercase">
              Financial Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              PayU Escrow &amp; Direct UPI Settlement
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              No unpaid invoices for creators. No unfulfilled briefs for brands. Fully protected by SHA-512 cryptographic verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-zinc-950">Brief &amp; Deliverables</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Brand selects an influencer or AI studio, defines deliverables, timeline, and campaign goals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-zinc-950">PayU Escrow Deposit</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Brand deposits funds via PayU (Cards, UPI, NetBanking). Funds are locked securely in escrow.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-zinc-950">Production &amp; Review</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Creator creates the content (Reel, YouTube video, AI ad) and submits a preview link for review.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="text-sm font-bold text-emerald-950">Approval &amp; Instant UPI</h4>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Brand approves deliverable. Escrow releases funds directly into the creator&apos;s verified UPI ID.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
