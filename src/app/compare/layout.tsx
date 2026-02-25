import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Companies | HiringLens",
  description:
    "Compare interview experiences at different companies side by side. See Reality Scores, ratings, red flags, and process metrics.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
