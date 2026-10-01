import React from 'react';
import { Icons } from './Icons';

interface AiCreatorBadgeProps {
  studioName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AiCreatorBadge({ studioName, size = 'md' }: AiCreatorBadgeProps) {
  if (size === 'sm') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50/80 text-purple-700 border border-purple-200/60 shadow-subtle">
        <Icons.Bot className="w-3 h-3 text-purple-600" />
        <span>AI Studio</span>
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-50/70 border border-purple-200/60 text-purple-900 shadow-subtle">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
      <Icons.Bot className="w-3.5 h-3.5 text-purple-600" />
      <span className="font-semibold tracking-wide text-[11px] uppercase">AI Video Specialist</span>
      {studioName && (
        <>
          <span className="text-purple-300">•</span>
          <span className="text-zinc-600 text-xs font-normal">{studioName}</span>
        </>
      )}
    </div>
  );
}
