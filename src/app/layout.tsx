import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { BackgroundGlow } from "@/components/layout/background-glow";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { AnalyticsWrapper } from "@/components/layout/analytics-wrapper";
import { CookieBanner } from "@/components/layout/cookie-banner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HiringLens - See How Companies Really Hire",
    template: "%s | HiringLens",
  },
  description:
    "Real interview experiences from real candidates. Know the process, prepare smarter, and interview with confidence.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "HiringLens",
    title: "HiringLens - See How Companies Really Hire",
    description:
      "Real interview experiences from real candidates. Know the process, prepare smarter, and interview with confidence.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "HiringLens - See How Companies Really Hire",
    description:
      "Real interview experiences from real candidates. Know the process, prepare smarter, and interview with confidence.",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-GB": siteUrl,
    },
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the nonce injected by middleware — used by Next.js for its inline
  // hydration scripts and available for any inline scripts in child pages.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>
        <div className="relative flex min-h-screen flex-col">
          <ScrollToTop />
          <BackgroundGlow />
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
        <CookieBanner />
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
