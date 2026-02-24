import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
          {/* Radial gradient background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[140px]" />
            <div className="absolute top-[350px] -right-32 h-[450px] w-[550px] rounded-full bg-emerald-300/12 blur-[110px]" />
            <div className="absolute top-[600px] -left-40 h-[350px] w-[450px] rounded-full bg-emerald-200/8 blur-[100px]" />
          </div>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
