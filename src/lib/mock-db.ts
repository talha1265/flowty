import { CreatorItem, Booking } from './types';

// In-memory persistent creators store with rich production-quality data
export const INITIAL_CREATORS: CreatorItem[] = [
  // --- HUMAN INFLUENCERS ---
  {
    id: "inf-1",
    userId: "usr-1",
    type: "INFLUENCER",
    displayName: "Aarav Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    bio: "Tech reviewer, consumer electronics enthusiast & gadget teardown specialist. Helping 850k+ make smarter tech choices.",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    niche: "Tech & Gadgets",
    followerCount: 850000,
    engagementRate: 5.4,
    startingPrice: 35000,
    upiId: "aaravtech@okhdfcbank",
    isVerified: true,
    rating: 4.9,
    totalReviews: 48,
    instagramHandle: "@aarav_tech",
    youtubeHandle: "TechWithAarav",
    audienceAge: {
      age13_17: 4,
      age18_24: 56,
      age25_34: 32,
      age35_44: 6,
      age45_plus: 2
    },
    audienceGender: {
      male: 78,
      female: 20,
      other: 2
    },
    packages: [
      {
        id: "pkg-aarav-1",
        title: "Instagram Reel (60s)",
        description: "1x High-energy tech demo/hands-on reel + link in bio for 48 hours.",
        price: 35000,
        turnaroundDays: 4,
        deliverables: ["1x 60s Reel", "Caption & Tagging", "48hr Bio Link"],
        revisions: 1
      },
      {
        id: "pkg-aarav-2",
        title: "Dedicated YouTube Review",
        description: "Full in-depth 8-12 min review, benchmark testing, and pinned comment.",
        price: 85000,
        turnaroundDays: 7,
        deliverables: ["8-12m YouTube Video", "Thumbnail Feature", "Pinned Comment Link"],
        revisions: 2
      },
      {
        id: "pkg-aarav-3",
        title: "Omnichannel Tech Launch",
        description: "1x YouTube Integration + 2x IG Reels + 3x Twitter/X Threads.",
        price: 130000,
        turnaroundDays: 10,
        deliverables: ["YouTube Integration (120s)", "2x IG Reels", "3x X/Twitter Threads"],
        revisions: 3
      }
    ]
  },
  {
    id: "inf-2",
    userId: "usr-2",
    type: "INFLUENCER",
    displayName: "Ananya Deshmukh",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    bio: "Fashion curator, sustainable luxury advocate & editorial model based between Mumbai & Paris.",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    niche: "Fashion & Lifestyle",
    followerCount: 420000,
    engagementRate: 6.8,
    startingPrice: 28000,
    upiId: "ananya.style@okicici",
    isVerified: true,
    rating: 5.0,
    totalReviews: 64,
    instagramHandle: "@ananyadeshmukh",
    youtubeHandle: "AnanyaVogue",
    audienceAge: {
      age13_17: 6,
      age18_24: 48,
      age25_34: 38,
      age35_44: 6,
      age45_plus: 2
    },
    audienceGender: {
      male: 22,
      female: 76,
      other: 2
    },
    packages: [
      {
        id: "pkg-ananya-1",
        title: "Aesthetic Reel / Lookbook",
        description: "Cinematic reel styling your product with editorial color grading.",
        price: 28000,
        turnaroundDays: 3,
        deliverables: ["1x Cinematic Reel", "Color Graded RAW Cuts", "Story Reshare"],
        revisions: 1
      },
      {
        id: "pkg-ananya-2",
        title: "Carousel + 3 Stories",
        description: "5-slide high-fashion studio carousel with swipe-up affiliate tracking.",
        price: 45000,
        turnaroundDays: 5,
        deliverables: ["5-Photo Carousel Post", "3x Interactive Stories", "Exclusive Discount Code"],
        revisions: 2
      }
    ]
  },
  {
    id: "inf-3",
    userId: "usr-3",
    type: "INFLUENCER",
    displayName: "Vikramaditya 'Vik' Rawat",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "CSCS Certified Strength Coach & Clean Nutritionist. Transforming fitness journeys with science-backed lifting.",
    city: "Delhi",
    state: "Delhi NCR",
    country: "India",
    niche: "Fitness & Wellness",
    followerCount: 290000,
    engagementRate: 7.2,
    startingPrice: 22000,
    upiId: "vikrawat@paytm",
    isVerified: true,
    rating: 4.8,
    totalReviews: 31,
    instagramHandle: "@coach_vik",
    youtubeHandle: "IronScienceVik",
    audienceAge: {
      age13_17: 8,
      age18_24: 62,
      age25_34: 24,
      age35_44: 5,
      age45_plus: 1
    },
    audienceGender: {
      male: 69,
      female: 30,
      other: 1
    },
    packages: [
      {
        id: "pkg-vik-1",
        title: "Workout Reel & Supplement Spotlight",
        description: "Authentic gym workout integration showcasing usage, benefits & flavor review.",
        price: 22000,
        turnaroundDays: 4,
        deliverables: ["1x 45s High Energy Reel", "Story with direct purchase link"],
        revisions: 1
      }
    ]
  },
  {
    id: "inf-4",
    userId: "usr-4",
    type: "INFLUENCER",
    displayName: "Neha & Rohan (Foodies Of Hyderabad)",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    bio: "Duo food vloggers unearthing secret royal biryanis, luxury dining & street gems across South India.",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    niche: "Food & Culinary",
    followerCount: 510000,
    engagementRate: 8.1,
    startingPrice: 30000,
    upiId: "hyderabadfoodies@ybl",
    isVerified: true,
    rating: 4.95,
    totalReviews: 89,
    instagramHandle: "@hyderabad_flavours",
    youtubeHandle: "HydFoodTrail",
    audienceAge: {
      age13_17: 5,
      age18_24: 45,
      age25_34: 40,
      age35_44: 8,
      age45_plus: 2
    },
    audienceGender: {
      male: 52,
      female: 47,
      other: 1
    },
    packages: [
      {
        id: "pkg-neha-1",
        title: "Restaurant / Cloud Kitchen Launch Reel",
        description: "On-site food tasting, kitchen behind-the-scenes & viral mouth-watering reel.",
        price: 30000,
        turnaroundDays: 3,
        deliverables: ["1x 9:16 Viral Reel", "Google Maps Location Tag", "3x Stories"],
        revisions: 1
      }
    ]
  },
  {
    id: "inf-5",
    userId: "usr-5",
    type: "INFLUENCER",
    displayName: "Kavya Menon",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    bio: "SEBI Registered RA & Financial Educator. Simplifying SIPs, credit cards & wealth creation for Gen-Z and millennials.",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    niche: "Finance & Crypto",
    followerCount: 340000,
    engagementRate: 4.9,
    startingPrice: 40000,
    upiId: "kavyamenon@okhdfcbank",
    isVerified: true,
    rating: 4.9,
    totalReviews: 54,
    instagramHandle: "@wealthwithkavya",
    youtubeHandle: "KavyaFinanceGuide",
    audienceAge: {
      age13_17: 2,
      age18_24: 55,
      age25_34: 35,
      age35_44: 6,
      age45_plus: 2
    },
    audienceGender: {
      male: 64,
      female: 35,
      other: 1
    },
    packages: [
      {
        id: "pkg-kavya-1",
        title: "Fintech App Explainer Reel",
        description: "Engaging hook, screen demo, safety features & referral incentive explanation.",
        price: 40000,
        turnaroundDays: 4,
        deliverables: ["1x 60s Reel", "Compliance Checklist Included", "Permanent Highlight"],
        revisions: 2
      }
    ]
  },

  // --- AI VIDEO CREATORS (SPECIAL PROFILE) ---
  {
    id: "ai-1",
    userId: "usr-ai-1",
    type: "AI_CREATOR",
    displayName: "Apex Neural Studios",
    studioName: "Apex Neural Studios (AI Production)",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    bio: "Pioneering generative AI video agency. We craft photorealistic humanoid spokespersons, CGI VFX product commercials & surreal cinematic ads using Runway Gen-3, Kling, and Sora.",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    niche: "AI Video & VFX",
    followerCount: 165000,
    engagementRate: 9.2,
    startingPrice: 18000,
    upiId: "apexneural@icici",
    isVerified: true,
    rating: 5.0,
    totalReviews: 37,
    aiToolsList: ["Runway Gen-3 Alpha", "Kling AI 1.5", "Midjourney v6.1", "ElevenLabs Voice Cloner", "Luma Dream Machine"],
    avatarStyle: "Hyper-realistic Humanoid & Futuristic Cyberpunk",
    promptSpecialty: "Cinematic Lighting, Dynamic Camera Tracking, High Precision Product Physics",
    commercialLicenseIncluded: true,
    audienceAge: {
      age13_17: 5,
      age18_24: 58,
      age25_34: 32,
      age35_44: 4,
      age45_plus: 1
    },
    audienceGender: {
      male: 72,
      female: 26,
      other: 2
    },
    sampleVideos: [
      {
        title: "Luxury Watch Water Morph Ad",
        prompt: "Ultra realistic cinematic slow motion macro shot of sapphire crystal chronograph watch emerging from liquid chrome mercury, raytraced reflections, Unreal Engine 5 aesthetic --ar 9:16",
        modelUsed: "Runway Gen-3 + Kling 1.5",
        aspectRatio: "9:16",
        durationSeconds: 15,
        thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        previewUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-moving-41484-large.mp4"
      },
      {
        title: "AI Humanoid Fashion Ambassador",
        prompt: "Photorealistic AI model walking in futuristic neo-Tokyo rainy street wearing neon puffer jacket, volumetric fog, 8k resolution, cinematic color grading",
        modelUsed: "Midjourney v6.1 + Luma Dream Machine",
        aspectRatio: "9:16",
        durationSeconds: 20,
        thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        previewUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-neon-lights-portrait-42525-large.mp4"
      }
    ],
    packages: [
      {
        id: "pkg-ai1-1",
        title: "30s Viral AI Short / Reel",
        description: "1x 30s High-production AI generated commercial with custom prompt engineering, sound design & ElevenLabs VO.",
        price: 18000,
        turnaroundDays: 2,
        deliverables: ["Full 4K Render (9:16)", "Sound Design & SFX", "ElevenLabs AI Voiceover", "Worldwide Commercial Rights"],
        revisions: 2
      },
      {
        id: "pkg-ai1-2",
        title: "Complete 60s AI Brand Commercial",
        description: "Scriptwriting + Custom AI Avatar Spokesperson + 6 dynamic B-roll scenes + licensed music score.",
        price: 45000,
        turnaroundDays: 4,
        deliverables: ["60s 4K Commercial (16:9 & 9:16)", "Custom AI Spokesperson", "Script & Voice Cloned Audio", "Full Res Project Assets"],
        revisions: 3
      }
    ]
  },
  {
    id: "ai-2",
    userId: "usr-ai-2",
    type: "AI_CREATOR",
    displayName: "SoraWave Labs",
    studioName: "SoraWave Labs (Generative Motion)",
    avatarUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    bio: "Specializing in mind-bending AI visual transitions, 3D CGI product simulations and multi-language AI talking avatars for brands.",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    niche: "AI Video & VFX",
    followerCount: 92000,
    engagementRate: 8.5,
    startingPrice: 15000,
    upiId: "sorawave@kotak",
    isVerified: true,
    rating: 4.9,
    totalReviews: 24,
    aiToolsList: ["Kling AI", "HeyGen Enterprise", "ElevenLabs", "Topaz Video AI", "Adobe Premiere Pro AI"],
    avatarStyle: "Corporate Modern & Virtual Influencer",
    promptSpecialty: "Morphing Transitions, Multilingual Dubbing, Seamless Product Compositing",
    commercialLicenseIncluded: true,
    audienceAge: {
      age13_17: 3,
      age18_24: 51,
      age25_34: 39,
      age35_44: 5,
      age45_plus: 2
    },
    audienceGender: {
      male: 66,
      female: 32,
      other: 2
    },
    sampleVideos: [
      {
        title: "Sneaker Zero Gravity Unboxing",
        prompt: "Futuristic athletic running shoe floating in anti-gravity vacuum chamber, laces glowing cyan neon, dynamic rotational camera, photoreal 4k",
        modelUsed: "Kling AI + Topaz 4K Upscale",
        aspectRatio: "9:16",
        durationSeconds: 15,
        thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        previewUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43093-large.mp4"
      }
    ],
    packages: [
      {
        id: "pkg-ai2-1",
        title: "AI Talking Head Explainer (45s)",
        description: "Ultra-realistic virtual presenter reading your script with perfect lip sync in English or Hindi.",
        price: 15000,
        turnaroundDays: 2,
        deliverables: ["45s Video (1080p/4K)", "Custom Studio Background", "Subtitles / Captions Burned-In"],
        revisions: 2
      },
      {
        id: "pkg-ai2-2",
        title: "3x AI Social Ad Variations",
        description: "3 unique hook variations for Meta & TikTok ads to A/B test your ROAS.",
        price: 36000,
        turnaroundDays: 3,
        deliverables: ["3x 20s AI Hook Variations", "Captions", "Audio Mix", "Ad Account Ready"],
        revisions: 2
      }
    ]
  },
  {
    id: "ai-3",
    userId: "usr-ai-3",
    type: "AI_CREATOR",
    displayName: "Synthetix VFX London",
    studioName: "Synthetix VFX Studios",
    avatarUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80",
    bio: "Global generative film director. We create award-winning AI cinematography, virtual fashion runways & hyper-creative music videos.",
    city: "London",
    country: "United Kingdom",
    niche: "AI Video & VFX",
    followerCount: 220000,
    engagementRate: 11.4,
    startingPrice: 65000,
    upiId: "synthetix@okhdfcbank",
    isVerified: true,
    rating: 5.0,
    totalReviews: 42,
    aiToolsList: ["Runway Gen-3", "ComfyUI Custom Workflows", "Kling AI", "Cinema 4D", "Suno AI Music"],
    avatarStyle: "High Fashion Virtual Avatars & Surrealist Art",
    promptSpecialty: "Complex Camera Movements, Anamorphic Lens Glare, Custom Model LoRAs",
    commercialLicenseIncluded: true,
    audienceAge: {
      age13_17: 2,
      age18_24: 42,
      age25_34: 45,
      age35_44: 9,
      age45_plus: 2
    },
    audienceGender: {
      male: 58,
      female: 40,
      other: 2
    },
    sampleVideos: [
      {
        title: "Cyberpunk Paris Fashion Week",
        prompt: "Surrealistic runway inside glass dome overlooking holographic Eiffel Tower, models wearing iridescent morphing silk",
        modelUsed: "Runway Gen-3 + ComfyUI LoRA",
        aspectRatio: "16:9",
        durationSeconds: 30,
        thumbnailUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80",
        previewUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31911-large.mp4"
      }
    ],
    packages: [
      {
        id: "pkg-ai3-1",
        title: "Hollywood Grade AI Teaser (30s)",
        description: "Full cinematic AI trailer / teaser with custom orchestral score and professional grade sound mastering.",
        price: 65000,
        turnaroundDays: 5,
        deliverables: ["4K ProRes Master", "Custom Sound Design", "Raw Clips Bundle", "Full Commercial Exclusivity"],
        revisions: 3
      }
    ]
  }
];

// Persistent state storage for runtime session
let creatorsStore = [...INITIAL_CREATORS];
let bookingsStore: Booking[] = [
  {
    id: "ord-demo-1",
    brandId: "brand-1",
    brandName: "Acme Tech Innovations",
    brandEmail: "growth@acmetech.io",
    creatorId: "inf-1",
    creatorName: "Aarav Sharma",
    creatorType: "INFLUENCER",
    creatorUpiId: "aaravtech@okhdfcbank",
    packageTitle: "Instagram Reel (60s)",
    packagePrice: 35000,
    platformFee: 1750,
    totalAmount: 36750,
    currency: "INR",
    status: "PAID_ESCROW",
    brief: "Review the new Flowty Pro wireless earbuds highlighting ANC and 40hr battery.",
    deliverables: ["1x 60s Reel", "Caption & Tagging", "48hr Bio Link"],
    payuTxnId: "FLW_1727710001_8F2A",
    payuPaymentId: "PAYU_994827110",
    payuStatus: "success",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "ord-demo-2",
    brandId: "brand-2",
    brandName: "Zephyr Energy Drinks",
    brandEmail: "partners@zephyrenergy.com",
    creatorId: "ai-1",
    creatorName: "Apex Neural Studios",
    creatorType: "AI_CREATOR",
    creatorUpiId: "apexneural@icici",
    packageTitle: "30s Viral AI Short / Reel",
    packagePrice: 18000,
    platformFee: 900,
    totalAmount: 18900,
    currency: "INR",
    status: "COMPLETED_RELEASED",
    brief: "CGI can exploding in anti-gravity with lightning effects and cyber beat.",
    deliverables: ["Full 4K Render (9:16)", "Sound Design & SFX", "ElevenLabs AI Voiceover", "Worldwide Commercial Rights"],
    payuTxnId: "FLW_1727650000_3B19",
    payuPaymentId: "PAYU_994112344",
    payuStatus: "success",
    workSubmissionUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-moving-41484-large.mp4",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const MockDB = {
  getCreators(filters?: {
    type?: string;
    city?: string;
    niche?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    minMalePercentage?: number;
    minFemalePercentage?: number;
    dominantAge?: string;
  }): CreatorItem[] {
    let result = [...creatorsStore];

    if (!filters) return result;

    if (filters.type && filters.type !== 'ALL') {
      result = result.filter(c => c.type === filters.type);
    }

    if (filters.city && filters.city !== 'ALL') {
      const cityLower = filters.city.toLowerCase();
      result = result.filter(c => c.city.toLowerCase().includes(cityLower));
    }

    if (filters.niche && filters.niche !== 'ALL') {
      const nicheLower = filters.niche.toLowerCase();
      result = result.filter(c => c.niche.toLowerCase().includes(nicheLower));
    }

    if (filters.minFollowers !== undefined && filters.minFollowers > 0) {
      result = result.filter(c => c.followerCount >= filters.minFollowers!);
    }

    if (filters.maxFollowers !== undefined && filters.maxFollowers > 0) {
      result = result.filter(c => c.followerCount <= filters.maxFollowers!);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter(c => c.startingPrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter(c => c.startingPrice <= filters.maxPrice!);
    }

    if (filters.minMalePercentage !== undefined && filters.minMalePercentage > 0) {
      result = result.filter(c => c.audienceGender.male >= filters.minMalePercentage!);
    }

    if (filters.minFemalePercentage !== undefined && filters.minFemalePercentage > 0) {
      result = result.filter(c => c.audienceGender.female >= filters.minFemalePercentage!);
    }

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c => 
        c.displayName.toLowerCase().includes(s) ||
        c.bio.toLowerCase().includes(s) ||
        c.city.toLowerCase().includes(s) ||
        c.niche.toLowerCase().includes(s) ||
        (c.studioName && c.studioName.toLowerCase().includes(s))
      );
    }

    return result;
  },

  getCreatorById(id: string): CreatorItem | undefined {
    return creatorsStore.find(c => c.id === id);
  },

  addCreator(creator: CreatorItem): CreatorItem {
    creatorsStore.unshift(creator);
    return creator;
  },

  getBookings(): Booking[] {
    return [...bookingsStore];
  },

  getBookingById(id: string): Booking | undefined {
    return bookingsStore.find(b => b.id === id);
  },

  getBookingByTxnId(txnId: string): Booking | undefined {
    return bookingsStore.find(b => b.payuTxnId === txnId);
  },

  createBooking(booking: Booking): Booking {
    bookingsStore.unshift(booking);
    return booking;
  },

  updateBookingStatus(id: string, status: Booking['status'], payuMeta?: { paymentId?: string; status?: string; submissionUrl?: string }): Booking | undefined {
    const booking = bookingsStore.find(b => b.id === id);
    if (!booking) return undefined;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    if (payuMeta?.paymentId) booking.payuPaymentId = payuMeta.paymentId;
    if (payuMeta?.status) booking.payuStatus = payuMeta.status;
    if (payuMeta?.submissionUrl) booking.workSubmissionUrl = payuMeta.submissionUrl;

    return booking;
  }
};
