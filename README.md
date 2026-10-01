# Flowty | Next-Gen Influencer & AI Video Creator Marketplace

A production-level marketplace platform built with **Next.js 14**, **Neon Serverless PostgreSQL**, **Prisma ORM**, and **PayU Payment Gateway with Escrow Protection**.

---

## 🌟 Key Features

### 1. Influencer & Creator Profiles
- **Personal & Location Details**: Display name, bio, social channel links, and city location (Mumbai, Bangalore, Delhi NCR, Hyderabad, Pune, London, etc.).
- **Audience Demographics Breakdown**:
  - **Age Brackets**: 13–17, 18–24 (Gen Z), 25–34 (Millennials), 35–44, 45+.
  - **Gender Split Ratio**: Percentage Male, Percentage Female, and Other with dual progress bars.
  - **Verified Metrics**: Total follower count (Nano, Micro, Mid, Macro), engagement rate %, star ratings, and verified review counts.
- **Niche Categories**: Tech & Gadgets, Fashion & Streetwear, Fitness & Wellness, Food & Culinary, Finance & Crypto, Travel & Adventure.
- **Dynamic Pricing Packages**: Modular deliverables (Instagram Reels, YouTube Dedicated, Product Teasers, Multi-channel Launches) with clear turnaround days and revision counts.
- **UPI ID Settlement**: Every creator has a validated UPI Virtual Payment Address (e.g., `creator@okhdfcbank`, `studio@icici`) for direct payouts.

---

### 2. Specialized AI Video Creator Profiles
- **Dedicated AI Showcase**: Distinct styling and dedicated portal for Generative AI Video Studios.
- **AI Tooling & Model Stack**: Tagging for Runway Gen-3 Alpha, Kling AI 1.5, Midjourney v6.1, ElevenLabs Voice Cloner, Luma Dream Machine, and Sora-ready pipelines.
- **Virtual Avatar Styles**: Photorealistic Humanoid, Virtual Spokesperson, Cyberpunk CGI, Anime 3D.
- **Prompt Recipes & Showcases**: Video previews accompanied by exact prompt engineering formulas and aspect ratios (9:16 vertical, 16:9 cinematic).
- **Commercial Rights Guarantee**: 100% worldwide commercial licensing included by default.

---

### 3. Precision Discovery & Multi-Parameter Filter Engine
Filter creators in real-time by:
1. **Search**: Keyword match across names, bios, prompts, and tools.
2. **Creator Type**: All Creators vs. Human Influencers vs. AI Video Studios.
3. **City / Geography**: Mumbai, Bangalore, Delhi, Hyderabad, Pune, London, etc.
4. **Niche**: Filter by exact vertical.
5. **Follower Range**: Nano (1k-20k), Micro (20k-100k), Mid (100k-500k), Macro (500k+).
6. **Audience Age**: Target Gen-Z (18-24 >45%), Millennials (25-34 >35%), or Mature audiences.
7. **Audience Gender**: Target Male-dominant (>60%), Female-dominant (>60%), or Balanced audiences.
8. **Budget**: Under ₹20k, ₹20k-₹50k, ₹50k-₹100k, ₹100k+.

---

### 4. PayU Gateway & Guaranteed Escrow Protection
- **SHA-512 End-to-End Cryptography**:
  - Request hash: `sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)`
  - Reverse response verification: `sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)`
- **Escrow Workflow**:
  1. Brand books a creator package.
  2. Total funds (Package price + 5% platform escrow fee) are securely deposited via PayU.
  3. Status updates to `PAID_ESCROW`.
  4. Creator produces content and submits deliverable link.
  5. Brand reviews and clicks **"Approve & Release Funds"**.
  6. Platform automatically settles payout directly to the creator's UPI ID.
- **Sandbox Simulation**: Includes instant one-click PayU sandbox simulator to test end-to-end escrow transactions without manual card entry.

---

### 5. Neon Serverless PostgreSQL Database
- Configured with Prisma ORM for Neon Postgres connection pooling.
- Complete schema for Users, InfluencerProfiles, AiCreatorProfiles, BookingOrders, Payouts, and Reviews.
- Robust dual-engine: Works seamlessly out of the box with persistent mock state, and connects instantly to Neon when `DATABASE_URL` is set in `.env`.

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your credentials:
```env
DATABASE_URL="postgresql://user:password@ep-your-neon-cluster.us-east-2.aws.neon.tech/flowty?sslmode=require"
PAYU_MERCHANT_KEY="gtKFFx"
PAYU_MERCHANT_SALT="eCwWELxi"
PAYU_MODE="test"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view Flowty.

---

## 📁 Project Structure

```
flowty/
├── prisma/
│   └── schema.prisma             # Neon PostgreSQL Database Schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── creators/         # Search, Filter & Profile Creation
│   │   │   ├── payments/payu/    # PayU SHA-512 Initiate & Verify
│   │   │   └── bookings/         # Escrow Management & UPI Release
│   │   ├── ai-creators/          # Dedicated AI Video Creators Gallery
│   │   ├── creators/             # Full Influencer Discovery & Profiles
│   │   ├── onboarding/           # Creator & AI Studio Onboarding Form
│   │   ├── checkout/             # PayU Escrow Checkout Page
│   │   ├── dashboard/
│   │   │   ├── brand/            # Brand Campaign & Escrow Manager
│   │   │   └── creator/          # Creator Earnings & UPI Settings
│   │   ├── globals.css           # Styling & Glassmorphic Utilities
│   │   └── layout.tsx            # App Layout & Nav/Footer
│   ├── components/
│   │   ├── Navbar.tsx            # Main Navigation Bar
│   │   ├── Footer.tsx            # Footer & Security Badges
│   │   ├── CreatorCard.tsx       # Profile Card with Quick Stats
│   │   ├── FilterBar.tsx         # City, Age, Gender, Niche, Budget Filter
│   │   ├── PayUModal.tsx         # PayU SHA-512 Payment Modal
│   │   ├── UpiBadge.tsx          # Copyable UPI ID Badge
│   │   ├── AiCreatorBadge.tsx    # AI Video Creator Badge
│   │   ├── AudienceDemographicsChart.tsx # Age & Gender Charts
│   │   └── Icons.tsx             # SVG Icons Collection
│   └── lib/
│       ├── types.ts              # Flowty TypeScript Definitions
│       ├── payu.ts               # PayU SHA-512 Generation & Verification
│       ├── security.ts           # Zod Input Validation & UPI Regex
│       ├── mock-db.ts            # Realistic Creators & Escrow State
│       └── prisma.ts             # Neon PostgreSQL Client
└── tailwind.config.js            # Tailwind Theme Extensions
```
