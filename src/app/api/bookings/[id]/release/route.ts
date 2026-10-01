import { NextRequest, NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = MockDB.getBookingById(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.status !== 'PAID_ESCROW' && booking.status !== 'DELIVERED') {
      return NextResponse.json(
        { success: false, message: `Cannot release funds when status is ${booking.status}` },
        { status: 400 }
      );
    }

    const updated = MockDB.updateBookingStatus(booking.id, 'COMPLETED_RELEASED');

    // Simulate instant UPI payout transfer to creator's UPI ID
    const payoutTxnRef = `UPI_PAYOUT_${Date.now().toString(36).toUpperCase()}_${booking.creatorUpiId.replace(/[^a-zA-Z0-9]/g, '')}`;

    return NextResponse.json({
      success: true,
      message: `Escrow funds of ₹${booking.packagePrice.toLocaleString('en-IN')} successfully released to ${booking.creatorName} at UPI ID: ${booking.creatorUpiId}`,
      booking: updated,
      payout: {
        amount: booking.packagePrice,
        upiId: booking.creatorUpiId,
        referenceId: payoutTxnRef,
        releasedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error releasing escrow' },
      { status: 500 }
    );
  }
}
