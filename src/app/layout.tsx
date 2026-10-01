import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flowty | Influencer & AI Video Creator Marketplace with PayU Escrow",
  description: "Discover, filter, and hire top human influencers & generative AI video creators by city, audience age, gender, follower tiers, and budget. 100% secured by PayU escrow and direct UPI settlements.",
  keywords: ["Influencer Marketing", "AI Video Creators", "PayU Payment Gateway", "UPI Escrow", "Audience Demographics", "Next.js Neon Marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} scroll-smooth`}>
      <body className="bg-[#fbfbfa] text-zinc-900 min-h-screen flex flex-col font-sans selection:bg-zinc-900 selection:text-white antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
