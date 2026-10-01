export type UserRole = 'BRAND' | 'INFLUENCER' | 'AI_CREATOR' | 'ADMIN';

export interface AudienceAgeBreakdown {
  age13_17: number;
  age18_24: number;
  age25_34: number;
  age35_44: number;
  age45_plus: number;
}

export interface AudienceGenderBreakdown {
  male: number;
  female: number;
  other: number;
}

export interface PricingPackage {
  id: string;
  title: string;
  description: string;
  price: number; // In INR
  turnaroundDays: number;
  deliverables: string[];
  revisions: number;
}

export interface AiSampleVideo {
  title: string;
  prompt: string;
  modelUsed: string; // e.g., "Runway Gen-3", "Kling AI", "Midjourney + Luma"
  aspectRatio: string;
  durationSeconds: number;
  thumbnailUrl: string;
  previewUrl: string;
}

export interface CreatorItem {
  id: string;
  userId: string;
  type: 'INFLUENCER' | 'AI_CREATOR';
  displayName: string;
  avatarUrl: string;
  bio: string;
  city: string;
  state?: string;
  country: string;
  niche: string;
  followerCount: number;
  engagementRate: number;
  startingPrice: number;
  upiId: string; // UPI ID for direct payout
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  
  // Demographics
  audienceAge: AudienceAgeBreakdown;
  audienceGender: AudienceGenderBreakdown;

  // Human Influencer specific
  instagramHandle?: string;
  youtubeHandle?: string;

  // AI Video Creator specific
  studioName?: string;
  aiToolsList?: string[];
  avatarStyle?: string;
  promptSpecialty?: string;
  sampleVideos?: AiSampleVideo[];
  commercialLicenseIncluded?: boolean;

  // Packages
  packages: PricingPackage[];
}

export type BookingStatus = 
  | 'PENDING'
  | 'PAID_ESCROW'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED_RELEASED'
  | 'DISPUTED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  brandId: string;
  brandName: string;
  brandEmail: string;
  creatorId: string;
  creatorName: string;
  creatorType: 'INFLUENCER' | 'AI_CREATOR';
  creatorUpiId: string;
  packageTitle: string;
  packagePrice: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  brief: string;
  deliverables: string[];
  payuTxnId?: string;
  payuPaymentId?: string;
  payuStatus?: string;
  workSubmissionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayUInitiatePayload {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  curl: string;
  hash: string;
  udf1?: string; // bookingId
  udf2?: string; // creatorId
  udf3?: string; // creatorType
  udf4?: string; // creatorUpi
  udf5?: string; // platform
}
