"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { container: "h-8 w-8", text: "text-xs", px: 32 },
  md: { container: "h-10 w-10", text: "text-sm", px: 40 },
  lg: { container: "h-14 w-14", text: "text-lg", px: 56 },
};

// Generate a consistent colour from a company name
function getAvatarColour(name: string): string {
  const colours = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-orange-100 text-orange-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-pink-100 text-pink-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colours[Math.abs(hash) % colours.length];
}

function getInitials(name: string): string {
  return name
    .split(/[\s&-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function CompanyLogo({ name, logoUrl, size = "md", className }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZES[size];

  // If we have a logo URL and it hasn't errored, show the image
  if (logoUrl && !imgError) {
    return (
      <div
        className={cn(
          s.container,
          "relative shrink-0 overflow-hidden rounded-lg border bg-white",
          className
        )}
      >
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={s.px}
          height={s.px}
          className="h-full w-full object-contain p-1"
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>
    );
  }

  // Fallback: letter avatar
  return (
    <div
      className={cn(
        s.container,
        s.text,
        "flex shrink-0 items-center justify-center rounded-lg font-semibold",
        getAvatarColour(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
