import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, avatarUrl, accountType, creatorType, city, niche, upiId } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: 'Google account details (email and name) are required.' },
        { status: 400 }
      );
    }

    const googleId = body.googleId || `g_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const user = await authService.authenticateWithGoogle({
      googleId,
      email,
      name,
      avatarUrl,
      accountType: accountType || 'BRAND',
      creatorType: creatorType || 'INFLUENCER',
      city,
      niche,
      upiId
    });

    return NextResponse.json({
      success: true,
      message: 'Google authentication successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error: any) {
    console.error('[Google Direct Auth Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to authenticate with Google.' },
      { status: 500 }
    );
  }
}
