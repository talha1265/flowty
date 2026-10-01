import { NextRequest, NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const status = formData.get('status') as string;
    const txnid = formData.get('txnid') as string;
    const mihpayid = formData.get('mihpayid') as string;
    const bookingId = formData.get('udf1') as string;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (status === 'success') {
      if (bookingId) {
        MockDB.updateBookingStatus(bookingId, 'PAID_ESCROW', {
          paymentId: mihpayid || `PAYU_${Date.now()}`,
          status: 'success'
        });
      }
      return NextResponse.redirect(`${baseUrl}/dashboard/brand?payment=success&bookingId=${bookingId}`, 303);
    } else {
      if (bookingId) {
        MockDB.updateBookingStatus(bookingId, 'CANCELLED', {
          paymentId: mihpayid,
          status: status || 'failed'
        });
      }
      return NextResponse.redirect(`${baseUrl}/dashboard/brand?payment=failed&bookingId=${bookingId}`, 303);
    }
  } catch (error) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard/brand?payment=error`, 303);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (status === 'success' && bookingId) {
    MockDB.updateBookingStatus(bookingId, 'PAID_ESCROW', {
      paymentId: `PAYU_REDIRECT_${Date.now()}`,
      status: 'success'
    });
    return NextResponse.redirect(`${baseUrl}/dashboard/brand?payment=success&bookingId=${bookingId}`);
  }

  return NextResponse.redirect(`${baseUrl}/dashboard/brand?payment=cancelled&bookingId=${bookingId || ''}`);
}
