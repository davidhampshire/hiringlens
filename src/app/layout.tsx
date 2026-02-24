import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackgroundGlow } from "@/components/layout/background-glow";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "HiringLens - See How Companies Really Hire",
    description:
      "Real interview experiences from real candidates. Know the process, prepare smarter, and interview with confidence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <BackgroundGlow />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
