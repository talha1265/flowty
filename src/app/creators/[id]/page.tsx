'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CreatorItem, PricingPackage } from '@/lib/types';
import { Icons } from '@/components/Icons';
import { AiCreatorBadge } from '@/components/AiCreatorBadge';
import { AudienceDemographicsChart } from '@/components/AudienceDemographicsChart';
import { PayUModal } from '@/components/PayUModal';

export default function CreatorDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [creator, setCreator] = useState<CreatorItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick brand booking details
  const [brandName] = useState('Acme Marketing Corp');
  const [brandEmail] = useState('brand@acmemarketing.com');
  const [brandPhone] = useState('9876543210');
  const [brief, setBrief] = useState('We need a high energy video promoting our new product launch.');

  useEffect(() => {
    if (!id) return;
    const fetchCreator = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/creators/${id}`);
        const data = await res.json();
        if (data.success && data.creator) {
          setCreator(data.creator);
          if (data.creator.packages && data.creator.packages.length > 0) {
            setSelectedPackage(data.creator.packages[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching creator', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-medium">Loading creator profile...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <Icons.AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-950">Creator Not Found</h2>
        <p className="text-xs text-zinc-500">The requested profile does not exist or has been removed.</p>
        <Link href="/creators" className="inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white">
          Back to Creators
        </Link>
      </div>
    );
  }

  const isAi = creator.type === 'AI_CREATOR';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Link href="/" className="hover:text-zinc-950">Home</Link>
        <span>/</span>
        <Link href="/creators" className="hover:text-zinc-950">Creators</Link>
        <span>/</span>
        <span className="text-zinc-950 font-semibold truncate max-w-[200px] sm:max-w-none">{creator.displayName}</span>
      </div>

      {/* Profile Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border bg-white shadow-subtle ${
        isAi ? 'border-purple-200/80' : 'border-zinc-200/80'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full md:w-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={creator.avatarUrl} 
              alt={creator.displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-1 ring-zinc-200 shadow-subtle"
            />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">{creator.displayName}</h1>
                {creator.isVerified && (
                  <span className="p-0.5 rounded-full bg-zinc-900 text-white shadow-xs" title="Verified Creator">
                    <Icons.CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                  </span>
                )}
                {isAi ? <AiCreatorBadge size="sm" /> : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/70">
                    Human Influencer
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-500">
                <span className="flex items-center gap-1 font-medium">
                  <Icons.MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {creator.city}{creator.state ? `, ${creator.state}` : ''}, {creator.country}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                  {creator.niche}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1 text-zinc-800 font-semibold">
                  <Icons.Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{creator.rating} ({creator.totalReviews} reviews)</span>
                </div>
              </div>

              {/* Secure Trust Badge */}
              <div className="pt-1 flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified Creator • PayU Escrow Protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white shadow-xs flex items-center justify-center gap-2 transition-all ${
                isAi 
                  ? 'bg-purple-700 hover:bg-purple-800' 
                  : 'bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Book via PayU Escrow</span>
            </button>
            <div className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1 font-medium">
              <Icons.Lock className="w-3 h-3 text-zinc-400" />
              <span>100% Escrow Protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">About the Creator</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">{creator.bio}</p>
          </div>

          {/* AI Creator Specific Section */}
          {isAi && (
            <div className="p-6 rounded-2xl bg-white border border-purple-200/80 shadow-subtle space-y-6">
              <div className="flex items-center gap-2">
                <Icons.Bot className="w-4 h-4 text-purple-700" />
                <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">AI Video Production Specifications</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1">
                  <span className="text-[10px] text-purple-700 uppercase font-bold tracking-wider">Avatar Style</span>
                  <p className="text-sm font-bold text-zinc-900">{creator.avatarStyle || 'Photorealistic Humanoid'}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">Commercial Rights</span>
                  <p className="text-sm font-bold text-emerald-950">Included Worldwide 100%</p>
                </div>
              </div>

              {/* Tools List */}
              {creator.aiToolsList && (
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-2">
                    AI Engines &amp; Video Models Used
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {creator.aiToolsList.map(tool => (
                      <span key={tool} className="text-xs px-3 py-1.5 rounded-lg bg-zinc-50 text-zinc-700 border border-zinc-200/70 font-mono font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Videos Showcase */}
              {creator.sampleVideos && creator.sampleVideos.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <Icons.Video className="w-4 h-4 text-purple-700" />
                    <span>Sample AI Video Showcases &amp; Prompts</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {creator.sampleVideos.map((sample, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden bg-zinc-50/80 border border-zinc-200/70 space-y-3 p-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={sample.thumbnailUrl} 
                            alt={sample.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-zinc-900/90 text-[10px] font-mono text-zinc-100">
                            {sample.modelUsed}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-zinc-950">{sample.title}</h5>
                          <p className="text-[11px] text-zinc-600 mt-1 line-clamp-2 italic font-mono bg-white p-2 rounded-lg border border-zinc-200/70">
                            &quot;{sample.prompt}&quot;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Demographics & Insights */}
          <div className="space-y-3">
            <AudienceDemographicsChart 
              age={creator.audienceAge} 
              gender={creator.audienceGender} 
            />
          </div>
        </div>

        {/* Right Column: Packages & Booking */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Packages</h3>
              <span className="text-xs text-zinc-700 font-semibold bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200/70">
                PayU Secured
              </span>
            </div>

            <div className="space-y-3">
              {creator.packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-50 border-zinc-900 shadow-xs ring-1 ring-zinc-900'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-zinc-950">{pkg.title}</h4>
                      <span className="text-sm font-extrabold text-zinc-950">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mb-2.5">{pkg.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.deliverables.map((del, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200/60">
                          ✓ {del}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2.5 text-[10px] text-zinc-500 font-medium flex items-center justify-between border-t border-zinc-100 pt-2">
                      <span>Turnaround: {pkg.turnaroundDays} Days</span>
                      <span>{pkg.revisions} Revisions</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campaign Brief Input */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="text-xs font-semibold text-zinc-700 block">
                Campaign Brief / Target:
              </label>
              <textarea
                rows={2}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="What should this video achieve?"
                className="w-full p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-900 outline-none focus:bg-white"
              />
            </div>

            {/* Book Now Button */}
            {selectedPackage && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Icons.CreditCard className="w-4 h-4 text-zinc-400" />
                <span>Pay ₹{selectedPackage.price.toLocaleString('en-IN')} via PayU</span>
              </button>
            )}

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-[11px] text-zinc-600 space-y-1">
              <span className="font-semibold text-emerald-800 block">Escrow Guarantee</span>
              <span>Funds remain safely locked in escrow until you approve the delivered work.</span>
            </div>
          </div>
        </div>
      </div>

      {/* PayU Modal */}
      {selectedPackage && (
        <PayUModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          creator={creator}
          packageItem={selectedPackage}
          brandData={{
            name: brandName,
            email: brandEmail,
            phone: brandPhone,
            brief
          }}
          onSuccess={(bookingId) => {
            setIsModalOpen(false);
            window.location.href = `/dashboard/brand?payment=success&bookingId=${bookingId}`;
          }}
        />
      )}
    </div>
  );
}
