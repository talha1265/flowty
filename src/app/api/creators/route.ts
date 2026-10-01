import { NextRequest, NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';
import { InfluencerProfileSchema, AiCreatorProfileSchema } from '@/lib/security';
import { CreatorItem } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const city = searchParams.get('city') || undefined;
    const niche = searchParams.get('niche') || undefined;
    const search = searchParams.get('search') || undefined;
    const minFollowers = searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')!) : undefined;
    const maxFollowers = searchParams.get('maxFollowers') ? parseInt(searchParams.get('maxFollowers')!) : undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const genderFocus = searchParams.get('genderFocus');
    const dominantAge = searchParams.get('dominantAge');

    let minMalePercentage: number | undefined;
    let minFemalePercentage: number | undefined;

    if (genderFocus === 'MALE_MAJORITY') {
      minMalePercentage = 60;
    } else if (genderFocus === 'FEMALE_MAJORITY') {
      minFemalePercentage = 60;
    }

    const creators = MockDB.getCreators({
      type,
      city,
      niche,
      search,
      minFollowers,
      maxFollowers,
      minPrice,
      maxPrice,
      minMalePercentage,
      minFemalePercentage,
      dominantAge: dominantAge || undefined
    });

    return NextResponse.json({
      success: true,
      count: creators.length,
      creators
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isAi = body.type === 'AI_CREATOR';

    let validatedData: any;
    if (isAi) {
      validatedData = AiCreatorProfileSchema.parse(body);
    } else {
      validatedData = InfluencerProfileSchema.parse(body);
    }

    const newCreatorId = isAi 
      ? `ai-${Date.now().toString(36)}` 
      : `inf-${Date.now().toString(36)}`;

    const newCreator: CreatorItem = {
      id: newCreatorId,
      userId: `usr-${Date.now().toString(36)}`,
      type: isAi ? 'AI_CREATOR' : 'INFLUENCER',
      displayName: isAi ? validatedData.studioName : validatedData.displayName,
      avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: validatedData.bio,
      city: validatedData.city,
      country: 'India',
      niche: isAi ? 'AI Video & VFX' : validatedData.niche,
      followerCount: validatedData.followerCount || 10000,
      engagementRate: isAi ? 9.0 : validatedData.engagementRate,
      startingPrice: validatedData.startingPrice,
      upiId: validatedData.upiId,
      isVerified: true,
      rating: 5.0,
      totalReviews: 1,
      audienceAge: isAi ? {
        age13_17: 5,
        age18_24: validatedData.audienceAge_18_24 || 50,
        age25_34: validatedData.audienceAge_25_34 || 35,
        age35_44: validatedData.audienceAge_35_plus || 10,
        age45_plus: 0
      } : {
        age13_17: validatedData.audienceAge_13_17,
        age18_24: validatedData.audienceAge_18_24,
        age25_34: validatedData.audienceAge_25_34,
        age35_44: validatedData.audienceAge_35_44,
        age45_plus: validatedData.audienceAge_45_plus
      },
      audienceGender: isAi ? {
        male: validatedData.audienceGenderMale || 65,
        female: validatedData.audienceGenderFemale || 35,
        other: 0
      } : {
        male: validatedData.audienceGenderMale,
        female: validatedData.audienceGenderFemale,
        other: validatedData.audienceGenderOther
      },
      // Human specific
      instagramHandle: validatedData.instagramHandle,
      youtubeHandle: validatedData.youtubeHandle,
      // AI specific
      studioName: validatedData.studioName,
      aiToolsList: validatedData.aiToolsList,
      avatarStyle: validatedData.avatarStyle,
      promptSpecialty: validatedData.promptSpecialty,
      sampleVideos: validatedData.sampleVideos,
      commercialLicenseIncluded: validatedData.commercialLicenseIncluded,
      packages: validatedData.pricingPackages
    };

    MockDB.addCreator(newCreator);

    return NextResponse.json({
      success: true,
      creator: newCreator,
      message: `${isAi ? 'AI Video Creator' : 'Influencer'} profile created successfully!`
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
