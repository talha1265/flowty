import { z } from 'zod';

// UPI ID validation regex (e.g., username@bank, name.surname@okhdfcbank, 9876543210@paytm)
export const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

export const InfluencerProfileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(60),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000),
  city: z.string().min(2, "City is required"),
  niche: z.string().min(2, "Niche category is required"),
  followerCount: z.number().int().min(100, "Follower count must be at least 100"),
  engagementRate: z.number().min(0.1).max(100),
  startingPrice: z.number().positive("Starting price must be positive"),
  upiId: z.string().regex(UPI_REGEX, "Invalid UPI ID format (e.g., name@okhdfcbank, user@upi)"),
  instagramHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  audienceAge_13_17: z.number().min(0).max(100),
  audienceAge_18_24: z.number().min(0).max(100),
  audienceAge_25_34: z.number().min(0).max(100),
  audienceAge_35_44: z.number().min(0).max(100),
  audienceAge_45_plus: z.number().min(0).max(100),
  audienceGenderMale: z.number().min(0).max(100),
  audienceGenderFemale: z.number().min(0).max(100),
  audienceGenderOther: z.number().min(0).max(100),
  pricingPackages: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(2),
      description: z.string(),
      price: z.number().positive(),
      turnaroundDays: z.number().int().positive(),
      deliverables: z.array(z.string()),
      revisions: z.number().int().default(1)
    })
  ).min(1, "At least one pricing package is required")
});

export const AiCreatorProfileSchema = z.object({
  studioName: z.string().min(2, "Studio or Creator name is required").max(60),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000),
  city: z.string().min(2, "City is required"),
  aiToolsList: z.array(z.string()).min(1, "Select at least 1 AI tool used"),
  avatarStyle: z.string().min(2, "Avatar style is required"),
  promptSpecialty: z.string().min(3, "Prompt specialty is required"),
  followerCount: z.number().int().default(5000),
  startingPrice: z.number().positive("Starting price must be positive"),
  turnaroundDays: z.number().int().positive().default(2),
  commercialLicenseIncluded: z.boolean().default(true),
  upiId: z.string().regex(UPI_REGEX, "Invalid UPI ID format (e.g., studio@icici, creator@upi)"),
  audienceAge_18_24: z.number().min(0).max(100),
  audienceAge_25_34: z.number().min(0).max(100),
  audienceAge_35_plus: z.number().min(0).max(100),
  audienceGenderMale: z.number().min(0).max(100),
  audienceGenderFemale: z.number().min(0).max(100),
  sampleVideos: z.array(
    z.object({
      title: z.string(),
      prompt: z.string(),
      modelUsed: z.string(),
      aspectRatio: z.string(),
      durationSeconds: z.number(),
      thumbnailUrl: z.string(),
      previewUrl: z.string()
    })
  ).min(1, "Provide at least 1 sample AI video showcase"),
  pricingPackages: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number().positive(),
      turnaroundDays: z.number().int().positive(),
      deliverables: z.array(z.string()),
      revisions: z.number().int().default(2)
    })
  ).min(1, "At least one package is required")
});

export const BookingInitiateSchema = z.object({
  creatorId: z.string().min(1, "Creator ID required"),
  packageId: z.string().min(1, "Package selection required"),
  brandName: z.string().min(2, "Brand name required"),
  brandEmail: z.string().email("Valid email required"),
  brandPhone: z.string().min(10, "Valid phone number required"),
  brief: z.string().min(10, "Please provide campaign brief instructions"),
});

export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}
