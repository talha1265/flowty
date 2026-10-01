'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreatorItem, Booking } from '@/lib/types';
import { Icons } from '@/components/Icons';
import { UpiBadge } from '@/components/UpiBadge';

export default function AdminDashboardPage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<'PAYOUTS' | 'CREATORS'>('PAYOUTS');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        fetch('/api/creators'),
        fetch('/api/bookings')
      ]);
      const cData = await cRes.json();
      const bData = await bRes.json();
      if (cData.success) setCreators(cData.creators);
      if (bData.success) setBookings(bData.bookings);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminDisburse = async (bookingId: string) => {
    setProcessingId(bookingId);
    setAdminNote(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/release`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAdminNote(`Disbursement Successful: ${data.message}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error processing payout');
    } finally {
      setProcessingId(null);
    }
  };

  const totalEscrow = bookings
    .filter(b => b.status === 'PAID_ESCROW' || b.status === 'DELIVERED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const totalDisbursed = bookings
    .filter(b => b.status === 'COMPLETED_RELEASED')
    .reduce((sum, b) => sum + (b.packagePrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
            <Icons.Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Platform Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Escrow Treasury &amp; Creator UPI Payouts
          </h1>
          <p className="text-xs text-slate-500">
            Confidential admin management for creator payout UPI accounts, PayU transaction settlement audits, and escrow disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/brand"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Brand View
          </Link>
          <Link
            href="/dashboard/creator"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Creator View
          </Link>
        </div>
      </div>

      {/* Admin Note Alert */}
      {adminNote && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{adminNote}</span>
        </div>
      )}

      {/* Treasury Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Active Escrow Treasury</span>
          <span className="text-2xl font-black text-slate-900 block">
            ₹{totalEscrow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">Held safely in PayU Escrow</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Total Settled to Creator UPI</span>
          <span className="text-2xl font-black text-indigo-700 block">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Successful disbursements</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Registered Creator Accounts</span>
          <span className="text-2xl font-black text-purple-700 block">
            {creators.length}
          </span>
          <span className="text-[11px] text-purple-700 font-medium">All with verified UPI VPAs</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setAdminTab('PAYOUTS')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            adminTab === 'PAYOUTS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Escrow Orders &amp; Disburse to UPI ({bookings.length})
        </button>
        <button
          onClick={() => setAdminTab('CREATORS')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            adminTab === 'CREATORS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Creator Directory &amp; Private UPI Records ({creators.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading admin ledger...</p>
        </div>
      ) : adminTab === 'PAYOUTS' ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Order ID &amp; Brand</th>
                  <th className="p-4">Creator Name</th>
                  <th className="p-4">Creator UPI ID (Confidential)</th>
                  <th className="p-4">Escrow Amount</th>
                  <th className="p-4">PayU Txn</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-semibold text-slate-900 block">#{b.id}</span>
                      <span className="text-slate-500 text-[11px]">{b.brandName}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {b.creatorName}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {b.creatorType === 'AI_CREATOR' ? 'AI Studio' : 'Influencer'}
                      </span>
                    </td>
                    <td className="p-4">
                      <UpiBadge upiId={b.creatorUpiId} label="Payout VPA" />
                    </td>
                    <td className="p-4">
                      <span className="font-black text-slate-900 block">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-600">Net: ₹{b.packagePrice.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {b.payuTxnId || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'COMPLETED_RELEASED'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : b.status === 'PAID_ESCROW' || b.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {b.status !== 'COMPLETED_RELEASED' ? (
                        <button
                          type="button"
                          onClick={() => handleAdminDisburse(b.id)}
                          disabled={processingId === b.id}
                          className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-60"
                        >
                          {processingId === b.id ? 'Disbursing...' : 'Disburse to UPI'}
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold">
                          ✓ Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Creator / Studio</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Confidential Payout UPI ID</th>
                  <th className="p-4">Followers</th>
                  <th className="p-4">Starting Rate</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creators.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 block">{c.displayName}</span>
                          <span className="text-slate-500 text-[11px]">{c.niche}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.type === 'AI_CREATOR'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {c.type === 'AI_CREATOR' ? 'AI Video' : 'Human'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{c.city}</td>
                    <td className="p-4">
                      <UpiBadge upiId={c.upiId} label="Admin VPA" />
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {c.followerCount?.toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{c.startingPrice?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
