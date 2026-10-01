import React from 'react';
import Link from 'next/link';
import { CreatorItem } from '@/lib/types';
import { Icons } from './Icons';
import { AiCreatorBadge } from './AiCreatorBadge';
import { AudienceDemographicsChart } from './AudienceDemographicsChart';

interface CreatorCardProps {
  creator: CreatorItem;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const isAi = creator.type === 'AI_CREATOR';

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-5 bg-white border transition-all duration-300 hover:-translate-y-1 ${
        isAi
          ? 'border-purple-200/80 hover:border-purple-300 shadow-subtle hover:shadow-[0_16px_36px_-6px_rgba(147,51,234,0.08)]'
          : 'border-zinc-200/90 hover:border-zinc-300 shadow-subtle hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.07)]'
      }`}
    >
      {/* Top Banner Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-zinc-200/80 shadow-xs group-hover:ring-zinc-300 transition-all"
              />
              {creator.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-zinc-900 ring-2 ring-white rounded-full p-0.5 text-white shadow-xs"
                  title="Verified Creator"
                >
                  <Icons.CheckCircle2 className="w-3.5 h-3.5 text-white fill-emerald-500" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-extrabold text-zinc-950 text-base truncate tracking-tight group-hover:text-indigo-600 transition-colors">
                {creator.displayName}
              </h3>

              <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1 font-medium text-zinc-600 truncate">
                  <Icons.MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">{creator.city}</span>
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium truncate">
                  {creator.niche}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isAi ? (
              <AiCreatorBadge size="sm" />
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/70 shadow-subtle">
                <Icons.Video className="w-3 h-3 text-zinc-500" />
                Creator
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-600 line-clamp-2 mb-3.5 leading-relaxed">
          {creator.bio}
        </p>

        {/* AI Tools */}
        {isAi && creator.aiToolsList && (
          <div className="mb-3.5">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block mb-1">
              AI Engines &amp; Workflows
            </span>
            <div className="flex flex-wrap gap-1.5">
              {creator.aiToolsList.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50/70 text-purple-700 border border-purple-200/60 font-mono font-medium"
                >
                  {tool}
                </span>
              ))}
              {creator.aiToolsList.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium">
                  +{creator.aiToolsList.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Audience Key Metrics Bar (Clean Dual-cell presentation) */}
        <div className="grid grid-cols-2 rounded-xl bg-zinc-50/80 border border-zinc-200/60 divide-x divide-zinc-200/60 mb-3.5 overflow-hidden">
          <div className="p-2.5 px-3">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider block">
              Followers
            </span>
            <span className="text-sm font-extrabold text-zinc-950 mt-0.5 block tracking-tight">
              {formatFollowers(creator.followerCount)}
            </span>
          </div>
          <div className="p-2.5 px-3">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider block">
              Engagement
            </span>
            <span className="text-sm font-extrabold text-emerald-600 flex items-center gap-1 mt-0.5">
              <Icons.TrendingUp className="w-3.5 h-3.5" />
              {creator.engagementRate}%
            </span>
          </div>
        </div>

        {/* Demographics Summary */}
        <div className="mb-3.5">
          <AudienceDemographicsChart age={creator.audienceAge} gender={creator.audienceGender} compact={true} />
        </div>

        {/* Trust Badges & Ratings */}
        <div className="mb-4 flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Escrow Protected</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-zinc-800">
            <Icons.Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{creator.rating}</span>
            <span className="text-zinc-600 font-normal">({creator.totalReviews})</span>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-zinc-600 block font-semibold uppercase tracking-wider">Starting at</span>
          <span className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-tight">
            {formatPrice(creator.startingPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/creators/${creator.id}`}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-700 transition-colors"
          >
            Profile
          </Link>
          <Link
            href={`/checkout/${creator.id}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs flex items-center gap-1.5 transition-all ${
              isAi
                ? 'bg-purple-700 hover:bg-purple-800'
                : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            <span>Book</span>
            <Icons.ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
