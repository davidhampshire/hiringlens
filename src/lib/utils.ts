import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatScore(score: number | null): string {
  if (score === null) return "N/A";
  return Math.round(score).toString();
}

export function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number | null): string {
  if (score === null) return "bg-muted";
  if (score >= 70) return "bg-emerald-50 border-emerald-200";
  if (score >= 40) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

/**
 * Format a date string as a human-readable relative time ("3 days ago", "2 weeks ago").
 * Safe to call on both server and client.
 */
export function formatRelativeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/**
 * Derive a Clearbit logo URL from a website URL or domain.
 * Returns null if the input can't be parsed into a valid domain.
 */
export function logoUrlFromWebsite(website: string | null | undefined): string | null {
  if (!website) return null;

  let domain: string;

  try {
    // Add protocol if missing so URL() can parse it
    const urlStr = website.includes("://") ? website : `https://${website}`;
    const url = new URL(urlStr);
    domain = url.hostname.replace(/^www\./, "");
  } catch {
    // If URL parsing fails, try treating the raw input as a domain
    const cleaned = website.replace(/^www\./, "").split("/")[0].trim();
    if (!cleaned || !cleaned.includes(".")) return null;
    domain = cleaned;
  }

  return `https://logo.clearbit.com/${domain}`;
}
