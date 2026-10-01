'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Booking } from '@/lib/types';
import { Icons } from '@/components/Icons';
import { UpiBadge } from '@/components/UpiBadge';

export default function CreatorDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatorUpi, setCreatorUpi] = useState('aaravtech@okhdfcbank');
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [newUpi, setNewUpi] = useState('');
  const [submissionUrlMap, setSubmissionUrlMap] = useState<Record<string, string>>({});
  const [submittedStatusMap, setSubmittedStatusMap] = useState<Record<string, boolean>>({});

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUpi.includes('@')) {
      setCreatorUpi(newUpi.trim());
      setIsEditingUpi(false);
      alert('UPI ID updated for all future escrow payouts!');
    } else {
      alert('Please enter a valid UPI address (e.g. name@okhdfcbank)');
    }
  };

  const handleSubmitDeliverable = (bookingId: string) => {
    const url = submissionUrlMap[bookingId];
    if (!url) {
      alert('Please enter a deliverables URL (Google Drive, Vimeo, unlisted video, etc.)');
      return;
    }
    setSubmittedStatusMap({ ...submittedStatusMap, [bookingId]: true });
    alert(`Deliverable submitted to brand! Brand will review and release funds to ${creatorUpi}.`);
  };

  const totalEarned = bookings
    .filter(b => b.status === 'COMPLETED_RELEASED')
    .reduce((sum, b) => sum + (b.packagePrice || 0), 0);

  const pendingEscrow = bookings
    .filter(b => b.status === 'PAID_ESCROW' || b.status === 'DELIVERED')
    .reduce((sum, b) => sum + (b.packagePrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <Icons.Zap className="w-3.5 h-3.5" />
            <span>Creator &amp; AI Studio Earnings Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Creator Dashboard &amp; Payouts
          </h1>
          <p className="text-xs text-slate-500">
            Track incoming brand orders, manage your payout UPI address, and submit completed video deliverables.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Icons.Sliders className="w-4 h-4" />
          <span>Edit Profile Packages</span>
        </Link>
      </div>

      {/* UPI Settlement Configuration Box */}
      <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active Settlement Destination (UPI)</span>
          </div>
          <p className="text-xs text-slate-500">
            All escrow releases are automatically deposited to this bank VPA without manual withdrawal delays.
          </p>
          <div className="pt-2">
            <UpiBadge upiId={creatorUpi} label="Direct Payout Account" />
          </div>
        </div>

        <div>
          {isEditingUpi ? (
            <form onSubmit={handleSaveUpi} className="flex items-center gap-2">
              <input
                type="text"
                value={newUpi}
                onChange={(e) => setNewUpi(e.target.value)}
                placeholder="newname@bank"
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-emerald-900 font-mono font-medium outline-none focus:bg-white focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingUpi(false)}
                className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setNewUpi(creatorUpi);
                setIsEditingUpi(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              Update UPI ID
            </button>
          )}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Total Lifetime Payouts</span>
          <span className="text-2xl font-black text-slate-900 block">
            ₹{totalEarned.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">Settled to your UPI ID</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Escrow Pending Delivery</span>
          <span className="text-2xl font-black text-amber-600 block">
            ₹{pendingEscrow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Locked in PayU Escrow</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Collaborations</span>
          <span className="text-2xl font-black text-indigo-700 block">
            {bookings.length}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Brand campaigns</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Incoming Client Orders</h3>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading incoming orders...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <Icons.Video className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No active orders yet</h4>
            <p className="text-xs text-slate-500">Share your profile link with brands to get booked with PayU Escrow.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isSubmitted = submittedStatusMap[booking.id] || booking.status === 'DELIVERED';
              const isPaidOut = booking.status === 'COMPLETED_RELEASED';

              return (
                <div
                  key={booking.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-slate-500">#{booking.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-bold text-slate-900">Client: {booking.brandName}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Package: <strong className="text-slate-800">{booking.packageTitle}</strong></p>
                    </div>

                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isPaidOut
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isSubmitted
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {isPaidOut ? '✓ Settled to Your UPI' : isSubmitted ? 'Review in Progress' : 'Action Required: Produce Video'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Your Payout Amount:</span>
                      <span className="font-black text-emerald-700 text-sm">₹{booking.packagePrice?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">PayU Transaction:</span>
                      <span className="font-mono text-slate-800 font-semibold">{booking.payuTxnId || 'FLW_ESCROW'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Client Email:</span>
                      <span className="text-slate-800 font-medium">{booking.brandEmail}</span>
                    </div>
                  </div>

                  {/* Campaign Brief */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500 block">Deliverable Brief:</span>
                    <p className="italic">&quot;{booking.brief}&quot;</p>
                  </div>

                  {/* Submission Box */}
                  {!isPaidOut && (
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="url"
                        placeholder="Paste deliverable link (Google Drive, Dropbox, YouTube Unlisted URL)..."
                        value={submissionUrlMap[booking.id] || ''}
                        onChange={(e) => setSubmissionUrlMap({ ...submissionUrlMap, [booking.id]: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmitDeliverable(booking.id)}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Icons.Video className="w-3.5 h-3.5" />
                        <span>Submit Work for Approval</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
