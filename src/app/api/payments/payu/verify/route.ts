import { NextRequest, NextResponse } from 'next/server';
import { verifyPayUHash } from '@/lib/payu';
import { MockDB } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { txnid, status, amount, bookingId, payuPaymentId, hash } = body;

    const booking = bookingId 
      ? MockDB.getBookingById(bookingId) 
      : MockDB.getBookingByTxnId(txnid);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking reference not found' },
        { status: 404 }
      );
    }

    const salt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';
    const key = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';

    // If reverse hash was sent from PayU, verify it
    if (hash) {
      const isValid = verifyPayUHash({
        status: status || 'success',
        email: booking.brandEmail,
        firstname: booking.brandName.split(' ')[0] || 'Brand',
        productinfo: `Flowty Escrow - ${booking.packageTitle}`,
        amount: amount || booking.totalAmount,
        txnid: txnid || booking.payuTxnId || '',
        key,
        salt,
        receivedHash: hash,
        udf1: booking.id,
        udf2: booking.creatorId,
        udf3: booking.creatorType,
        udf4: booking.creatorUpiId,
        udf5: 'flowty_platform'
      });

      if (!isValid) {
        console.warn('[PayU Verify] Hash mismatch detected for txn:', txnid);
      }
    }

    if (status === 'success' || status === 'captured') {
      MockDB.updateBookingStatus(booking.id, 'PAID_ESCROW', {
        paymentId: payuPaymentId || `PAYU_${Date.now()}`,
        status: 'success'
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and secured in escrow',
        booking: MockDB.getBookingById(booking.id)
      });
    } else {
      MockDB.updateBookingStatus(booking.id, 'CANCELLED', {
        status: status || 'failed'
      });

      return NextResponse.json({
        success: false,
        message: 'Payment was not successful or was cancelled by user',
        booking: MockDB.getBookingById(booking.id)
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[PayU Verify Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
