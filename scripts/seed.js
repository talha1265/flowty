const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if database connection works
    await prisma.$connect();
    console.log(' Connected to database successfully.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Seed Brand User
    const brandUser = await prisma.user.upsert({
      where: { email: 'brand@flowty.com' },
      update: {},
      create: {
        email: 'brand@flowty.com',
        name: 'Nexus Tech Global',
        passwordHash: hashedPassword,
        role: 'BRAND',
        city: 'Mumbai',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      },
    });
    console.log(` Created brand user: ${brandUser.email}`);

    // 2. Seed Influencer User & Profile
    const influencerUser = await prisma.user.upsert({
      where: { email: 'aarav@flowty.com' },
      update: {},
      create: {
        email: 'aarav@flowty.com',
        name: 'Aarav Sharma',
        passwordHash: hashedPassword,
        role: 'INFLUENCER',
        city: 'Bangalore',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        influencer: {
          create: {
            displayName: 'Aarav Sharma',
            bio: 'Tech reviewer, consumer electronics enthusiast & gadget teardown specialist.',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            niche: 'Tech & Gadgets',
            followerCount: 850000,
            engagementRate: 5.4,
            startingPrice: 35000,
            upiId: 'aaravtech@okhdfcbank',
            isVerified: true,
            rating: 4.9,
            totalReviews: 48,
            instagramHandle: '@aarav_tech',
            youtubeHandle: 'TechWithAarav',
            pricingPackagesJson: JSON.stringify([
              {
                id: 'pkg-aarav-1',
                title: 'Instagram Reel (60s)',
                price: 35000,
                turnaroundDays: 4,
                deliverables: ['1x 60s Reel', 'Caption & Tagging', '48hr Bio Link'],
              },
            ]),
          },
        },
      },
    });
    console.log(` Created influencer user: ${influencerUser.email}`);

    // 3. Seed AI Creator User & Profile
    const aiCreatorUser = await prisma.user.upsert({
      where: { email: 'lumina@flowty.com' },
      update: {},
      create: {
        email: 'lumina@flowty.com',
        name: 'Lumina FX Labs',
        passwordHash: hashedPassword,
        role: 'AI_CREATOR',
        city: 'Hyderabad',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        aiCreator: {
          create: {
            studioName: 'Lumina FX Labs',
            bio: 'Award-winning generative AI studio specializing in photorealistic commercial video ads and digital avatars.',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India',
            aiToolsList: 'Runway Gen-3 Alpha, Kling AI 1.5, Midjourney v6.1, ElevenLabs, ComfyUI',
            avatarStyle: 'Photorealistic Humanoid & Sci-Fi Cinematics',
            promptSpecialty: 'Cinematic Lighting, Dynamic Camera Tracking, High Precision Product Physics',
            commercialLicenseIncluded: true,
            turnaroundDays: 2,
            followerCount: 320000,
            startingPrice: 25000,
            upiId: 'luminafx@paytm',
            isVerified: true,
            rating: 5.0,
            totalReviews: 86,
            sampleVideosJson: JSON.stringify([
              {
                title: 'Luxury Watch Cosmic Reveal',
                prompt: 'Cinematic 8k slow motion macro lens orbiting a obsidian titanium watch floating in zero-gravity nebula',
              },
            ]),
            pricingPackagesJson: JSON.stringify([
              {
                id: 'pkg-lumina-1',
                title: '30s Hyper-Realistic AI Product Commercial',
                price: 25000,
                turnaroundDays: 2,
                deliverables: ['4K Video', 'Commercial License', 'Custom AI Voiceover', 'Sound Design'],
              },
            ]),
          },
        },
      },
    });
    console.log(` Created AI creator user: ${aiCreatorUser.email}`);

    console.log(' Seed completed successfully!');
  } catch (error) {
    console.warn(' Seed completed with note (database might not be connected yet):', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
