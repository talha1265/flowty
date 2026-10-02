import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

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
    <html lang="en" className="scroll-smooth">
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
