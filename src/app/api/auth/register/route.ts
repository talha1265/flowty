import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';
import { UPI_REGEX } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accountType, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Password validation (min 8 chars)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await authService.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    if (accountType === 'BRAND') {
      const { companyName, phone, city, industry } = body;
      if (!companyName || companyName.trim().length === 0) {
        return NextResponse.json(
          { success: false, message: 'Company / Brand name is required.' },
          { status: 400 }
        );
      }

      const user = await authService.createBrandAccount({
        companyName,
        email,
        password,
        phone,
        city,
        industry
      });

      return NextResponse.json({
        success: true,
        message: 'Brand account created successfully.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } else if (accountType === 'CREATOR') {
      const { displayName, creatorType, city, niche, upiId, phone, bio, startingPrice, followerCount, aiTools } = body;

      if (!displayName || displayName.trim().length === 0) {
        return NextResponse.json(
          { success: false, message: 'Creator / Studio display name is required.' },
          { status: 400 }
        );
      }

      if (!upiId || !UPI_REGEX.test(upiId.trim())) {
        return NextResponse.json(
          { success: false, message: 'A valid UPI ID is required for creator payout settlements (e.g. yourname@okhdfcbank).' },
          { status: 400 }
        );
      }

      const user = await authService.createCreatorAccount({
        displayName,
        email,
        password,
        creatorType: creatorType === 'AI_CREATOR' ? 'AI_CREATOR' : 'INFLUENCER',
        city: city || 'Mumbai',
        niche: niche || 'Tech & Gadgets',
        upiId: upiId.trim(),
        phone,
        bio,
        startingPrice: startingPrice ? Number(startingPrice) : undefined,
        followerCount: followerCount ? Number(followerCount) : undefined,
        aiTools: Array.isArray(aiTools) ? aiTools : undefined
      });

      return NextResponse.json({
        success: true,
        message: 'Creator profile & account created successfully.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid account type specified. Must be BRAND or CREATOR.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[Register API Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
