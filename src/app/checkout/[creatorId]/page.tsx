'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CreatorItem, PricingPackage } from '@/lib/types';
import { Icons } from '@/components/Icons';
import { PayUModal } from '@/components/PayUModal';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params?.creatorId as string;

  const [creator, setCreator] = useState<CreatorItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [brandName, setBrandName] = useState('Nexus Consumer Brands');
  const [brandEmail, setBrandEmail] = useState('campaigns@nexusbrands.co');
  const [brandPhone, setBrandPhone] = useState('9876543210');
  const [brief, setBrief] = useState('Launch promotion for our new summer activewear range with high engagement call-to-action.');

  useEffect(() => {
    if (!creatorId) return;
    const fetchCreator = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/creators/${creatorId}`);
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
  }, [creatorId]);

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <div className="w-9 h-9 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Setting up secure PayU checkout session...</p>
      </div>
    );
  }

  if (!creator || !selectedPackage) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <Icons.AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Creator or Package Not Found</h2>
        <Link href="/creators" className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white">
          Back to Creators
        </Link>
      </div>
    );
  }

  const basePrice = selectedPackage.price;
  const platformFee = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + platformFee;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href={`/creators/${creator.id}`} className="hover:text-indigo-600">{creator.displayName}</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">PayU Escrow Checkout</span>
      </div>

      <div className="text-left space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>PayU Escrow Payment Protection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Book &amp; Secure Collaboration
        </h1>
        <p className="text-xs text-slate-500">
          Funds are deposited into verified PayU Escrow. The creator is notified to begin production immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Brand Details & Campaign Brief */}
        <div className="lg:col-span-2 space-y-6">
          {/* Creator Summary Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="w-14 h-14 rounded-2xl object-cover border border-indigo-200"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-base">{creator.displayName}</h3>
                <span className="text-xs text-slate-500">{creator.niche} • {creator.city}</span>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Icons.CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Bank &amp; Escrow Account Verified</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Deliverable</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 inline-block">
                {selectedPackage.title}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Brand &amp; Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Billing Email (For PayU Receipt)</label>
                <input
                  type="email"
                  required
                  value={brandEmail}
                  onChange={(e) => setBrandEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (For PayU OTP &amp; Notifications)</label>
              <input
                type="tel"
                required
                value={brandPhone}
                onChange={(e) => setBrandPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-2">
              2. Campaign Brief &amp; Video Instructions
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Campaign Goals, Key Message &amp; Required Deliverables
              </label>
              <textarea
                rows={4}
                required
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Include product links, talking points, brand guidelines or prompt ideas..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Right Form: PayU Escrow Summary & Trigger */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900">Escrow Payment Breakdown</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Creator Package Fee:</span>
                <span className="font-bold text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Escrow Guarantee (5%):
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1 rounded font-bold border border-emerald-200">
                    Secured
                  </span>
                </span>
                <span className="font-bold text-slate-900">₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                <span>Total Payable:</span>
                <span className="text-indigo-600 text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* PayU Badge */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                <Icons.CreditCard className="w-4 h-4" />
                <span>PayU Gateway Encryption</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Supports UPI, Cards, NetBanking &amp; Wallets. 256-bit SHA-512 cryptographic verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Icons.ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Checkout ₹{totalAmount.toLocaleString('en-IN')} with PayU</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <Icons.Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Escrow released only upon your final approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* PayU Modal */}
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
          router.push(`/dashboard/brand?payment=success&bookingId=${bookingId}`);
        }}
      />
    </div>
  );
}
