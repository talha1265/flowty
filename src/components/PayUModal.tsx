'use client';

import React, { useState } from 'react';
import { Icons } from './Icons';
import { CreatorItem, PricingPackage } from '@/lib/types';

interface PayUModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorItem;
  packageItem: PricingPackage;
  brandData: {
    name: string;
    email: string;
    phone: string;
    brief: string;
  };
  onSuccess: (bookingId: string) => void;
}

export function PayUModal({
  isOpen,
  onClose,
  creator,
  packageItem,
  brandData,
  onSuccess,
}: PayUModalProps) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [payuPayload, setPayuPayload] = useState<any>(null);
  const [step, setStep] = useState<'REVIEW' | 'PAYU_INIT' | 'SUCCESS'>('REVIEW');

  if (!isOpen) return null;

  const basePrice = packageItem.price;
  const platformFee = Math.round(basePrice * 0.05); // 5% platform escrow fee
  const totalAmount = basePrice + platformFee;

  const handleInitiatePayU = async () => {
    setLoading(true);
    setStatusText('Generating secure SHA-512 signature & PayU escrow token...');

    try {
      const res = await fetch('/api/payments/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: creator.id,
          packageId: packageItem.id,
          packageTitle: packageItem.title,
          amount: totalAmount,
          brandName: brandData.name,
          brandEmail: brandData.email,
          brandPhone: brandData.phone,
          brief: brandData.brief,
          creatorUpiId: creator.upiId,
          creatorType: creator.type
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment initiation failed');
      }

      setPayuPayload(data.payuData);
      setStep('PAYU_INIT');
    } catch (err: any) {
      alert(err.message || 'Error initiating PayU payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSandboxPayment = async () => {
    if (!payuPayload) return;
    setLoading(true);
    setStatusText('Verifying PayU Reverse SHA-512 Hash & Confirming Escrow...');

    try {
      const res = await fetch('/api/payments/payu/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txnid: payuPayload.txnid,
          status: 'success',
          amount: payuPayload.amount,
          bookingId: payuPayload.udf1,
          payuPaymentId: `PAYU_MOCK_${Date.now()}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess(payuPayload.udf1);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Icons.ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">PayU Escrow Checkout</h3>
              <p className="text-[11px] text-slate-500 font-medium">100% Protected Payment Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icons.Check className="w-5 h-5 rotate-45" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {step === 'REVIEW' && (
            <>
              {/* Creator & Package Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={creator.avatarUrl} 
                      alt={creator.displayName}
                      className="w-10 h-10 rounded-xl object-cover border border-indigo-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{creator.displayName}</h4>
                      <span className="text-xs text-slate-500">{creator.niche} • {creator.city}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                    {creator.type === 'AI_CREATOR' ? 'AI Studio' : 'Influencer'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Selected Package:</span>
                  <span className="font-bold text-slate-800">{packageItem.title}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Package Deliverables</span>
                  <span className="font-semibold text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    Escrow &amp; Platform Fee (5%)
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1 rounded font-semibold border border-indigo-200">
                      Protected
                    </span>
                  </span>
                  <span className="font-semibold text-slate-900">₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount Payable</span>
                  <span className="text-indigo-600 text-base font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Escrow Vault Notice (Creator UPI is safely kept in admin escrow) */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Escrow Payment Vault
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    100% REFUNDABLE
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  Your funds are held safely in escrow. They are only released once you review and approve the completed video deliverables.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleInitiatePayU}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>{statusText || 'Processing...'}</span>
                ) : (
                  <>
                    <Icons.CreditCard className="w-4 h-4" />
                    <span>Proceed to Secure PayU Payment</span>
                  </>
                )}
              </button>
            </>
          )}

          {step === 'PAYU_INIT' && payuPayload && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-indigo-200 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <Icons.ShieldCheck className="w-4 h-4" />
                  <span>PayU SHA-512 Security Hash Signed</span>
                </div>
                
                <div className="text-[11px] font-mono space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 overflow-x-auto">
                  <div><strong>Txn ID:</strong> {payuPayload.txnid}</div>
                  <div><strong>Merchant Key:</strong> {payuPayload.key}</div>
                  <div><strong>Amount:</strong> ₹{payuPayload.amount}</div>
                  <div className="truncate"><strong>SHA-512 Hash:</strong> {payuPayload.hash}</div>
                </div>
              </div>

              {/* Real PayU Form */}
              <form action={payuPayload.actionUrl || "https://test.payu.in/_payment"} method="POST" target="_blank">
                <input type="hidden" name="key" value={payuPayload.key} />
                <input type="hidden" name="txnid" value={payuPayload.txnid} />
                <input type="hidden" name="amount" value={payuPayload.amount} />
                <input type="hidden" name="productinfo" value={payuPayload.productinfo} />
                <input type="hidden" name="firstname" value={payuPayload.firstname} />
                <input type="hidden" name="email" value={payuPayload.email} />
                <input type="hidden" name="phone" value={payuPayload.phone} />
                <input type="hidden" name="surl" value={payuPayload.surl} />
                <input type="hidden" name="furl" value={payuPayload.furl} />
                <input type="hidden" name="curl" value={payuPayload.curl} />
                <input type="hidden" name="hash" value={payuPayload.hash} />
                <input type="hidden" name="udf1" value={payuPayload.udf1} />
                <input type="hidden" name="udf2" value={payuPayload.udf2} />
                <input type="hidden" name="udf3" value={payuPayload.udf3} />
                <input type="hidden" name="udf4" value={payuPayload.udf4} />

                <button
                  type="submit"
                  className="w-full mb-2 py-3 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.ExternalLink className="w-4 h-4" />
                  <span>Launch Official PayU Gateway Portal</span>
                </button>
              </form>

              {/* Instant Sandbox Simulator Button */}
              <button
                type="button"
                onClick={handleSimulateSandboxPayment}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying PayU Reverse Hash...</span>
                ) : (
                  <>
                    <Icons.Zap className="w-4 h-4 text-emerald-600" />
                    <span>Simulate Successful PayU Payment (Instant Escrow)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <Icons.Check className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Confirmed in Escrow!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your payment of ₹{totalAmount.toLocaleString('en-IN')} has been safely deposited into Flowty Escrow. The creator has been notified to begin work!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
