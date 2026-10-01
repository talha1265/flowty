'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Booking } from '@/lib/types';
import { Icons } from '@/components/Icons';
import { UpiBadge } from '@/components/UpiBadge';

export default function BrandDashboardPage() {
  const searchParams = useSearchParams();
  const paymentState = searchParams.get('payment');
  const bookedId = searchParams.get('bookingId');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [releaseNotification, setReleaseNotification] = useState<string | null>(null);

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

  const handleReleaseEscrow = async (bookingId: string) => {
    setReleasingId(bookingId);
    setReleaseNotification(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/release`, {
        method: 'POST'
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setReleaseNotification(data.message);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Error releasing escrow');
    } finally {
      setReleasingId(null);
    }
  };

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const inEscrow = bookings
    .filter(b => b.status === 'PAID_ESCROW' || b.status === 'IN_PROGRESS' || b.status === 'DELIVERED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const completedCount = bookings.filter(b => b.status === 'COMPLETED_RELEASED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Icons.ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Brand Campaign Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Brand Dashboard &amp; Escrow Orders
          </h1>
          <p className="text-xs text-slate-500">
            Monitor campaigns, review deliverables, and release PayU escrow payouts to creator UPI IDs.
          </p>
        </div>

        <Link
          href="/creators"
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Icons.Search className="w-4 h-4" />
          <span>Hire Another Creator</span>
        </Link>
      </div>

      {/* Payment Success Alert */}
      {paymentState === 'success' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Icons.CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">PayU Payment Successful &amp; Locked in Escrow!</h4>
              <p className="text-xs text-emerald-700">
                Order #{bookedId || ''} is now active. Creator has been notified to produce your video.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold">
            ESCROW SECURED
          </span>
        </div>
      )}

      {/* Release Notification */}
      {releaseNotification && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-3 text-indigo-900 text-xs font-medium">
          <Icons.CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <span>{releaseNotification}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Total Bookings Value</span>
          <span className="text-2xl font-black text-slate-900 block">
            ₹{totalSpent.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{bookings.length} Campaigns</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-emerald-700">Currently in Escrow</span>
          <span className="text-2xl font-black text-emerald-700 block">
            ₹{inEscrow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Protected until approved</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500">Completed &amp; Settled</span>
          <span className="text-2xl font-black text-indigo-700 block">
            {completedCount}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Paid out to creator UPI</span>
        </div>
      </div>

      {/* Bookings Table / List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Active &amp; Past Campaigns</h3>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading campaign orders...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <Icons.CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No campaigns found</h4>
            <p className="text-xs text-slate-500">You haven&apos;t booked any creators yet.</p>
            <Link href="/creators" className="inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white">
              Discover Creators
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isEscrow = booking.status === 'PAID_ESCROW' || booking.status === 'DELIVERED';
              const isCompleted = booking.status === 'COMPLETED_RELEASED';

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
                        <span className="text-sm font-bold text-slate-900">{booking.creatorName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          booking.creatorType === 'AI_CREATOR'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {booking.creatorType === 'AI_CREATOR' ? 'AI Studio' : 'Influencer'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Package: <strong className="text-slate-800">{booking.packageTitle}</strong></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isEscrow
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isCompleted
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {booking.status === 'PAID_ESCROW' && '🔒 In Escrow'}
                        {booking.status === 'DELIVERED' && '📦 Work Submitted'}
                        {booking.status === 'COMPLETED_RELEASED' && '✓ Released to UPI'}
                        {booking.status === 'PENDING' && '⏳ Payment Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">PayU Transaction ID:</span>
                      <span className="font-mono text-slate-900 font-semibold">{booking.payuTxnId || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Total Paid (Escrow):</span>
                      <span className="font-black text-slate-900 text-sm">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Creator Payout Destination:</span>
                      <UpiBadge upiId={booking.creatorUpiId} label="UPI" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Campaign Brief:</span>
                    <p className="line-clamp-2 italic">&quot;{booking.brief}&quot;</p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {booking.workSubmissionUrl && (
                        <a
                          href={booking.workSubmissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-indigo-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Icons.Video className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Review Delivered Video</span>
                        </a>
                      )}
                    </div>

                    {isEscrow && (
                      <button
                        type="button"
                        onClick={() => handleReleaseEscrow(booking.id)}
                        disabled={releasingId === booking.id}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-2 disabled:opacity-60"
                      >
                        <Icons.CheckCircle2 className="w-4 h-4 text-emerald-100" />
                        <span>
                          {releasingId === booking.id ? 'Releasing to UPI...' : `Approve & Release ₹${booking.packagePrice?.toLocaleString('en-IN')} to Creator UPI`}
                        </span>
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <Icons.Check className="w-4 h-4 text-emerald-600" />
                        <span>Payout Completed to {booking.creatorUpiId}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
