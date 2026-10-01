import React from 'react';
import Link from 'next/link';
import { Icons } from './Icons';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-[#fafafa] text-zinc-600 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                <Icons.Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-zinc-950">Flowty.</span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-xs">
              Premier marketplace connecting forward-thinking brands with top creators and generative AI video studios. Backed by PayU escrow and direct UPI settlements.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-white border border-zinc-200/80 text-[10px] text-zinc-700 font-mono font-medium shadow-subtle">
                PayU Escrow
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-zinc-200/80 text-[10px] text-zinc-700 font-mono font-medium shadow-subtle">
                Instant UPI
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Brands &amp; Agencies</h4>
            <ul className="space-y-2 text-zinc-500">
              <li><Link href="/creators" className="hover:text-zinc-950 transition-colors">Discover Creators</Link></li>
              <li><Link href="/ai-creators" className="hover:text-zinc-950 transition-colors">AI Video Studios</Link></li>
              <li><Link href="/creators?niche=Tech%20%26%20Gadgets" className="hover:text-zinc-950 transition-colors">Tech Influencers</Link></li>
              <li><Link href="/creators?niche=Fashion%20%26%20Lifestyle" className="hover:text-zinc-950 transition-colors">Fashion &amp; Lifestyle</Link></li>
              <li><Link href="/dashboard/brand" className="hover:text-zinc-950 transition-colors">Campaign Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">For Creators</h4>
            <ul className="space-y-2 text-zinc-500">
              <li><Link href="/onboarding" className="hover:text-zinc-950 transition-colors">Create Profile</Link></li>
              <li><Link href="/onboarding?type=AI_CREATOR" className="hover:text-zinc-950 transition-colors">Register AI Studio</Link></li>
              <li><Link href="/dashboard/creator" className="hover:text-zinc-950 transition-colors">Payout Settings</Link></li>
              <li><a href="#how-escrow-works" className="hover:text-zinc-950 transition-colors">Escrow Guarantee</a></li>
            </ul>
          </div>

          {/* Col 4: Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Trust &amp; Security</h4>
            <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 space-y-1.5 shadow-subtle">
              <div className="flex items-center gap-1.5 text-zinc-900 font-semibold text-xs">
                <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PayU Escrow Protected</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Funds remain secured in escrow until deliverables meet brief specifications.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-600">
              <Icons.Lock className="w-3.5 h-3.5 text-zinc-600" />
              <span>SHA-512 Cryptographic Verification</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-xs">
          <span>&copy; {new Date().getFullYear()} Flowty. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Escrow Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
