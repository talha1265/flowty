'use client';

import React, { useState } from 'react';
import { Icons } from './Icons';

interface UpiBadgeProps {
  upiId: string;
  label?: string;
  showVerified?: boolean;
}

export function UpiBadge({ upiId, label = "Payout UPI", showVerified = true }: UpiBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleCopy}
      title="Click to copy UPI ID"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-800 hover:bg-emerald-100 transition-colors text-xs font-mono group"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="font-bold text-emerald-700 text-[10px] tracking-wider uppercase">{label}:</span>
      <span className="font-semibold text-emerald-900">{upiId}</span>
      {copied ? (
        <Icons.Check className="w-3.5 h-3.5 text-emerald-700 ml-0.5" />
      ) : (
        <Icons.Copy className="w-3.5 h-3.5 text-emerald-600/70 group-hover:text-emerald-800 ml-0.5" />
      )}
    </button>
  );
}
