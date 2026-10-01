import { NextRequest, NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');
    const brandId = searchParams.get('brandId');

    let bookings = MockDB.getBookings();

    if (creatorId) {
      bookings = bookings.filter(b => b.creatorId === creatorId);
    }
    if (brandId) {
      bookings = bookings.filter(b => b.brandId === brandId);
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching bookings' },
      { status: 500 }
    );
  }
}
