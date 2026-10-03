'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreatorItem } from '@/lib/types';
import { CreatorCard } from '@/components/CreatorCard';
import { Icons } from '@/components/Icons';
import { AiCreatorBadge } from '@/components/AiCreatorBadge';

export default function AiCreatorsPage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiCreators = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/creators?type=AI_CREATOR');
        const data = await res.json();
        if (data.success) {
          setCreators(data.creators);
        }
      } catch (err) {
        console.error('Error fetching AI creators', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAiCreators();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-white border border-purple-200/70 overflow-hidden shadow-subtle space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <AiCreatorBadge size="md" />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            Specialized <span className="ai-gradient-text">Generative AI Video</span> Studios
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Skip expensive physical sets and film crews. Hire elite AI prompt directors producing photorealistic virtual spokespersons, CGI product physics, dynamic visual hooks, and cinematic ads in 48 hours.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Runway Gen-3 Alpha',
              'Kling AI 1.5 HD',
              'Midjourney v6.1 LoRA',
              'ElevenLabs Multi-voice',
              'Luma Dream Machine',
              'Topaz 4K Upscale',
              'Commercial Worldwide Rights'
            ].map(tech => (
              <span key={tech} className="text-xs px-2.5 py-1 rounded-lg bg-zinc-50 text-zinc-700 border border-zinc-200/70 font-mono font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-2 flex flex-wrap gap-3">
          <Link
            href="/onboarding?type=AI_CREATOR"
            className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-purple-700 hover:bg-purple-800 shadow-xs transition-all flex items-center gap-2"
          >
            <Icons.Bot className="w-4 h-4" />
            <span>Join as an AI Video Creator</span>
          </Link>
          <a
            href="#ai-studios"
            className="px-6 py-3 rounded-xl font-medium text-xs text-zinc-700 bg-white border border-zinc-200/80 hover:bg-zinc-50 transition-all shadow-subtle"
          >
            View Available Studios
          </a>
        </div>
      </div>

      {/* Studios Grid */}
      <div id="ai-studios" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">Featured Generative Video Studios</h2>
            <p className="text-xs text-zinc-500">All studios backed by guaranteed PayU Escrow &amp; UPI payouts.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-purple-800 bg-purple-50/80 px-3 py-1 rounded-full border border-purple-200/70">
            {creators.length} Studios Available
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-medium">Loading generative AI video studios...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-zinc-500 md:hidden mb-2 px-1">
              <span className="flex items-center gap-1 font-medium text-purple-700">
                <span>Swipe AI studios horizontally</span>
                <span>&rarr;</span>
              </span>
              <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold border border-purple-200/50">
                {creators.length} studios
              </span>
            </div>
            <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-5 md:pb-0 gap-4 sm:gap-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:grid-cols-2 lg:grid-cols-3">
              {creators.map(creator => (
                <div key={creator.id} className="w-[84vw] sm:w-[350px] md:w-auto shrink-0 snap-center md:snap-align-none flex flex-col">
                  <CreatorCard creator={creator} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
