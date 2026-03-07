import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

export const metadata: Metadata = {
  title: "Compare Companies",
  description:
    "Compare interview experiences at different companies side by side. See Reality Scores, ratings, red flags, and process metrics.",
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
  openGraph: {
    title: "Compare Companies | HiringLens",
    description:
      "Compare interview experiences side by side. See how companies stack up on Reality Scores, ratings, and more.",
    url: `${siteUrl}/compare`,
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
