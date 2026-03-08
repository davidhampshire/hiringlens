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
