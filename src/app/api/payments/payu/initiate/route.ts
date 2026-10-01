import { NextRequest, NextResponse } from 'next/server';
import { generatePayUHash, generateTxnId, getPayUEndpoint } from '@/lib/payu';
import { MockDB } from '@/lib/mock-db';
import { Booking } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      creatorId,
      packageId,
      packageTitle,
      amount,
      brandName,
      brandEmail,
      brandPhone,
      brief,
      creatorUpiId,
      creatorType
    } = body;

    if (!creatorId || !amount || !brandEmail || !brandName) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking details' },
        { status: 400 }
      );
    }

    const creator = MockDB.getCreatorById(creatorId);
    if (!creator) {
      return NextResponse.json(
        { success: false, message: 'Creator not found' },
        { status: 404 }
      );
    }

    const key = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
    const salt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
    const txnid = generateTxnId('FLW');
    const bookingId = `ord-${Date.now().toString(36)}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const surl = `${baseUrl}/api/payments/payu/response?status=success&bookingId=${bookingId}`;
    const furl = `${baseUrl}/api/payments/payu/response?status=failure&bookingId=${bookingId}`;
    const curl = `${baseUrl}/api/payments/payu/response?status=cancel&bookingId=${bookingId}`;

    const numAmount = parseFloat(amount);
    const platformFee = Math.round(numAmount * 0.05);
    const creatorEarnings = numAmount - platformFee;

    // Generate SHA-512 Hash
    const hash = generatePayUHash({
      key,
      txnid,
      amount: numAmount,
      productinfo: `Flowty Escrow - ${packageTitle}`,
      firstname: brandName.split(' ')[0] || 'Brand',
      email: brandEmail,
      udf1: bookingId,
      udf2: creatorId,
      udf3: creatorType || 'INFLUENCER',
      udf4: creatorUpiId || creator.upiId,
      udf5: 'flowty_platform',
      salt
    });

    // Create Initial Booking Record
    const newBooking: Booking = {
      id: bookingId,
      brandId: `brand-${Date.now().toString(36)}`,
      brandName,
      brandEmail,
      creatorId,
      creatorName: creator.displayName,
      creatorType: creator.type,
      creatorUpiId: creator.upiId,
      packageTitle,
      packagePrice: numAmount - platformFee,
      platformFee,
      totalAmount: numAmount,
      currency: 'INR',
      status: 'PENDING',
      brief: brief || 'Direct collaboration booking',
      deliverables: creator.packages.find(p => p.id === packageId)?.deliverables || ['Digital Deliverable'],
      payuTxnId: txnid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MockDB.createBooking(newBooking);

    return NextResponse.json({
      success: true,
      bookingId,
      payuData: {
        actionUrl: getPayUEndpoint(),
        key,
        txnid,
        amount: numAmount.toFixed(2),
        productinfo: `Flowty Escrow - ${packageTitle}`,
        firstname: brandName.split(' ')[0] || 'Brand',
        email: brandEmail,
        phone: brandPhone || '9876543210',
        surl,
        furl,
        curl,
        hash,
        udf1: bookingId,
        udf2: creatorId,
        udf3: creatorType || 'INFLUENCER',
        udf4: creatorUpiId || creator.upiId,
        udf5: 'flowty_platform'
      }
    });
  } catch (error: any) {
    console.error('[PayU Initiate Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
