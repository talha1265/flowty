import { NextRequest, NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const creator = MockDB.getCreatorById(params.id);

    if (!creator) {
      return NextResponse.json(
        { success: false, message: 'Creator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      creator
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching creator' },
      { status: 500 }
    );
  }
}
