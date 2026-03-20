"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  /** Fallback: derive logo domain from website URL when logoUrl is absent */
  websiteUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const SIZES = {
  sm: { container: "h-8 w-8", text: "text-xs", px: 32 },
  md: { container: "h-10 w-10", text: "text-sm", px: 40 },
  lg: { container: "h-14 w-14", text: "text-lg", px: 56 },
  xl: { container: "h-[72px] w-[72px]", text: "text-xl", px: 72 },
  "2xl": { container: "h-24 w-24", text: "text-2xl", px: 96 },
};

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

function extractDomain(logoUrl: string): string | null {
  if (!logoUrl.includes("/")) return logoUrl;
  try {
    const url = new URL(logoUrl);
    if (url.hostname === "logo.clearbit.com") {
      return url.pathname.replace(/^\//, "");
    }
    if (url.hostname === "www.google.com" && url.pathname.includes("favicons")) {
      return null;
    }
    return null;
  } catch {
    return logoUrl;
  }
}

function googleFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

export function CompanyLogo({ name, logoUrl, websiteUrl, size = "md", className }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZES[size];

  let resolvedUrl: string | null = null;

  if (!imgError) {
    if (logoUrl) {
      const domain = extractDomain(logoUrl);
      resolvedUrl = domain ? googleFaviconUrl(domain) : logoUrl;
    } else if (websiteUrl) {
      // Derive logo from website URL when no explicit logoUrl is stored
      try {
        const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
        resolvedUrl = googleFaviconUrl(domain);
      } catch {
        // Invalid URL — fall through to initials
      }
    }
  }

  if (resolvedUrl) {
    return (
      <div
        className={cn(
          s.container,
          "relative shrink-0 overflow-hidden rounded-xl border bg-white",
          className
        )}
      >
        <Image
          src={resolvedUrl}
          alt={`${name} logo`}
          width={s.px}
          height={s.px}
          sizes={`${s.px}px`}
          className="h-full w-full object-contain p-1.5"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        s.container,
        s.text,
        "flex shrink-0 items-center justify-center rounded-xl font-semibold",
        getAvatarColour(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
