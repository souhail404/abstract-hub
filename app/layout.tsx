import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Abstract Events — Discover Ecosystem Events",
    template: "%s | Abstract Events",
  },
  description:
    "The central hub for all events happening in the Abstract ecosystem. Discover streams, tournaments, AMAs, workshops, and community events.",
  keywords: ["Abstract", "blockchain", "crypto events", "Web3", "gaming", "DeFi", "ecosystem"],
  openGraph: {
    title: "Abstract Events",
    description: "Discover all events happening in the Abstract ecosystem",
    type: "website",
    siteName: "Abstract Events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abstract Events",
    description: "Discover all events happening in the Abstract ecosystem",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
