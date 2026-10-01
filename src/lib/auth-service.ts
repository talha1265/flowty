import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { MockDB } from './mock-db';
import { UserRole } from './types';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  city?: string;
  upiId?: string;
  googleId?: string;
  passwordHash?: string;
  createdAt: string;
}

// Persistent In-memory store for development/fallback when Neon DB is not directly connected
const inMemoryUsers: BaseUser[] = [
  {
    id: 'usr-brand-demo',
    email: 'brand@acmemarketing.com',
    name: 'Acme Marketing Corp',
    role: 'BRAND',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    passwordHash: bcrypt.hashSync('Password@123', 10),
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-creator-demo',
    email: 'aarav@flowty.com',
    name: 'Aarav Sharma',
    role: 'INFLUENCER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98123 45678',
    city: 'Bangalore',
    upiId: 'aaravtech@okhdfcbank',
    passwordHash: bcrypt.hashSync('Password@123', 10),
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-ai-demo',
    email: 'neura@flowty.com',
    name: 'NeuraMotion Studio',
    role: 'AI_CREATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    city: 'Bangalore',
    upiId: 'neuramotion@axl',
    passwordHash: bcrypt.hashSync('Password@123', 10),
    createdAt: new Date().toISOString()
  }
];

export const authService = {
  /**
   * Find user by email (checks Neon DB first, falls back to in-memory)
   */
  async getUserByEmail(email: string): Promise<BaseUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });
      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as UserRole,
          avatarUrl: dbUser.avatarUrl || undefined,
          phone: dbUser.phone || undefined,
          city: dbUser.city || undefined,
          upiId: dbUser.upiId || undefined,
          googleId: dbUser.googleId || undefined,
          passwordHash: dbUser.passwordHash || undefined,
          createdAt: dbUser.createdAt.toISOString()
        };
      }
    } catch {
      // Neon DB not available, check in-memory store
    }

    const localUser = inMemoryUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    return localUser || null;
  },

  /**
   * Find user by ID
   */
  async getUserById(id: string): Promise<BaseUser | null> {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id } });
      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as UserRole,
          avatarUrl: dbUser.avatarUrl || undefined,
          phone: dbUser.phone || undefined,
          city: dbUser.city || undefined,
          upiId: dbUser.upiId || undefined,
          googleId: dbUser.googleId || undefined,
          passwordHash: dbUser.passwordHash || undefined,
          createdAt: dbUser.createdAt.toISOString()
        };
      }
    } catch {
      // Fallback
    }

    const localUser = inMemoryUsers.find((u) => u.id === id);
    return localUser || null;
  },

  /**
   * Create Brand Account with Password
   */
  async createBrandAccount(data: {
    companyName: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    industry?: string;
  }): Promise<BaseUser> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await this.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = `usr-brand-${Date.now().toString(36)}`;
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.companyName)}`;

    const newUser: BaseUser = {
      id: userId,
      email: normalizedEmail,
      name: data.companyName.trim(),
      role: 'BRAND',
      avatarUrl,
      phone: data.phone?.trim() || undefined,
      city: data.city?.trim() || 'Mumbai',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    try {
      await prisma.user.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: 'BRAND',
          passwordHash: newUser.passwordHash!,
          avatarUrl: newUser.avatarUrl,
          phone: newUser.phone,
          city: newUser.city
        }
      });
    } catch {
      // Neon DB unavailable, stored in in-memory
    }

    inMemoryUsers.unshift(newUser);
    return newUser;
  },

  /**
   * Create Creator Account with Password
   */
  async createCreatorAccount(data: {
    displayName: string;
    email: string;
    password: string;
    creatorType: 'INFLUENCER' | 'AI_CREATOR';
    city: string;
    niche: string;
    upiId: string;
    phone?: string;
    bio?: string;
    startingPrice?: number;
    followerCount?: number;
    aiTools?: string[];
  }): Promise<BaseUser> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await this.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = `usr-creator-${Date.now().toString(36)}`;
    const avatarUrl =
      data.creatorType === 'AI_CREATOR'
        ? `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80`
        : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80`;

    const role: UserRole = data.creatorType === 'AI_CREATOR' ? 'AI_CREATOR' : 'INFLUENCER';

    const newUser: BaseUser = {
      id: userId,
      email: normalizedEmail,
      name: data.displayName.trim(),
      role,
      avatarUrl,
      phone: data.phone?.trim() || undefined,
      city: data.city.trim(),
      upiId: data.upiId.trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };

    // Save to DB or inMemoryUsers
    try {
      await prisma.user.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role,
          passwordHash: newUser.passwordHash!,
          avatarUrl: newUser.avatarUrl,
          phone: newUser.phone,
          city: newUser.city,
          upiId: newUser.upiId
        }
      });
    } catch {
      // Neon DB fallback
    }

    inMemoryUsers.unshift(newUser);

    // Register creator in marketplace catalog
    MockDB.addCreator({
      id: `cr-${Date.now().toString(36)}`,
      userId: newUser.id,
      type: data.creatorType,
      displayName: newUser.name,
      avatarUrl: newUser.avatarUrl!,
      bio: data.bio || (data.creatorType === 'AI_CREATOR'
        ? 'Next-gen generative AI video studio delivering high conversion viral video hooks and photorealistic CGI.'
        : 'Content creator & digital influencer helping brands connect authentically with engaged audiences.'),
      city: data.city,
      country: 'India',
      niche: data.niche,
      followerCount: data.followerCount || (data.creatorType === 'AI_CREATOR' ? 35000 : 50000),
      engagementRate: 5.6,
      startingPrice: data.startingPrice || (data.creatorType === 'AI_CREATOR' ? 12000 : 15000),
      upiId: data.upiId.trim(),
      isVerified: true,
      rating: 5.0,
      totalReviews: 1,
      audienceAge: {
        age13_17: 5,
        age18_24: 55,
        age25_34: 30,
        age35_44: 8,
        age45_plus: 2
      },
      audienceGender: {
        male: 60,
        female: 38,
        other: 2
      },
      aiToolsList: data.aiTools || (data.creatorType === 'AI_CREATOR' ? ['Runway Gen-3', 'Kling AI', 'Midjourney v6.1'] : undefined),
      packages: [
        {
          id: `pkg-${Date.now().toString(36)}`,
          title: data.creatorType === 'AI_CREATOR' ? 'Standard 4K AI Video Render' : 'Instagram Reel (60s)',
          description: 'High production value, full commercial rights, and 2 rounds of revisions.',
          price: data.startingPrice || (data.creatorType === 'AI_CREATOR' ? 12000 : 15000),
          turnaroundDays: 3,
          deliverables: ['1x Full HD/4K Video', 'Commercial Worldwide Rights', '2 Revisions'],
          revisions: 2
        }
      ]
    });

    return newUser;
  },

  /**
   * Verify email and password credentials
   */
  async verifyPassword(email: string, passwordPlain: string): Promise<BaseUser | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  },

  /**
   * Authenticate or register with Google OAuth
   */
  async authenticateWithGoogle(data: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
    accountType?: 'BRAND' | 'CREATOR';
    creatorType?: 'INFLUENCER' | 'AI_CREATOR';
    city?: string;
    niche?: string;
    upiId?: string;
  }): Promise<BaseUser> {
    const normalizedEmail = data.email.trim().toLowerCase();
    let user = await this.getUserByEmail(normalizedEmail);

    if (user) {
      // Existing user: Link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = data.googleId;
        if (!user.avatarUrl && data.avatarUrl) {
          user.avatarUrl = data.avatarUrl;
        }
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { googleId: data.googleId, avatarUrl: user.avatarUrl }
          });
        } catch {
          // Fallback
        }
      }
      return user;
    }

    // New user signing up with Google
    const isCreator = data.accountType === 'CREATOR';
    const role: UserRole = isCreator
      ? (data.creatorType === 'AI_CREATOR' ? 'AI_CREATOR' : 'INFLUENCER')
      : 'BRAND';

    const userId = `usr-google-${Date.now().toString(36)}`;
    const newUser: BaseUser = {
      id: userId,
      email: normalizedEmail,
      name: data.name.trim(),
      role,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name)}`,
      city: data.city || (isCreator ? 'Bangalore' : 'Mumbai'),
      upiId: data.upiId?.trim() || (isCreator ? `${data.name.toLowerCase().replace(/\s+/g, '')}@okaxis` : undefined),
      googleId: data.googleId,
      createdAt: new Date().toISOString()
    };

    try {
      await prisma.user.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
          city: newUser.city,
          upiId: newUser.upiId,
          googleId: newUser.googleId
        }
      });
    } catch {
      // Fallback
    }

    inMemoryUsers.unshift(newUser);

    if (isCreator) {
      MockDB.addCreator({
        id: `cr-google-${Date.now().toString(36)}`,
        userId: newUser.id,
        type: data.creatorType || 'INFLUENCER',
        displayName: newUser.name,
        avatarUrl: newUser.avatarUrl!,
        bio: 'Verified creator on Flowty marketplace ready for brand collaborations with secured PayU escrow.',
        city: newUser.city || 'Bangalore',
        country: 'India',
        niche: data.niche || 'Tech & Gadgets',
        followerCount: 45000,
        engagementRate: 5.8,
        startingPrice: 15000,
        upiId: newUser.upiId || 'creator@okhdfcbank',
        isVerified: true,
        rating: 5.0,
        totalReviews: 1,
        audienceAge: { age13_17: 5, age18_24: 55, age25_34: 30, age35_44: 8, age45_plus: 2 },
        audienceGender: { male: 60, female: 38, other: 2 },
        packages: [
          {
            id: `pkg-${Date.now().toString(36)}`,
            title: 'Featured Collaboration Package',
            description: 'Full production delivered with commercial rights and revisions.',
            price: 15000,
            turnaroundDays: 3,
            deliverables: ['1x Post/Video', 'Commercial License', '2 Revisions'],
            revisions: 2
          }
        ]
      });
    }

    return newUser;
  }
};
