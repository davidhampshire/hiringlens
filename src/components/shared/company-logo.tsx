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

/**
 * Extract the domain from a logo_url stored in the DB.
 * Handles:
 *  - Direct domains: "deliveroo.co.uk"
 *  - Clearbit URLs: "https://logo.clearbit.com/deliveroo.co.uk"
 *  - Google URLs: "https://www.google.com/s2/favicons?domain=deliveroo.co.uk&sz=128"
 *  - Any URL with a path: return null (custom uploaded logo)
 */
function extractDomain(logoUrl: string): string | null {
  // If it looks like a bare domain (no protocol, no slashes)
  if (!logoUrl.includes("/")) return logoUrl;

  try {
    const url = new URL(logoUrl);

    // Clearbit-style: https://logo.clearbit.com/{domain}
    if (url.hostname === "logo.clearbit.com") {
      return url.pathname.replace(/^\//, "");
    }

    // Google favicon-style: already a working URL
    if (url.hostname === "www.google.com" && url.pathname.includes("favicons")) {
      return null; // already a full working Google URL, don't re-derive
    }

    return null;
  } catch {
    // Not a URL — treat as domain
    return logoUrl;
  }
}

/**
 * Build a Google Favicon URL from a domain.
 * Returns a 128px favicon which is good enough for card-sized logos.
 */
function googleFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

export function CompanyLogo({ name, logoUrl, size = "md", className }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZES[size];

  // Determine the actual image URL to use
  let resolvedUrl: string | null = null;

  if (logoUrl && !imgError) {
    const domain = extractDomain(logoUrl);
    if (domain) {
      // Convert any stored domain/Clearbit URL to Google Favicon
      resolvedUrl = googleFaviconUrl(domain);
    } else {
      // Already a full working URL (Google favicon or custom)
      resolvedUrl = logoUrl;
    }
  }

  if (resolvedUrl) {
    return (
      <div
        className={cn(
          s.container,
          "relative shrink-0 overflow-hidden rounded-lg border bg-white",
          className
        )}
      >
        <Image
          src={resolvedUrl}
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
