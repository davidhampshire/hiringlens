import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import type { CompanyScore } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

function companyPriority(totalReviews: number): number {
  if (totalReviews >= 10) return 0.9;
  if (totalReviews >= 3) return 0.8;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Use company_scores so we can get last_review_at for accurate lastModified
  const { data } = await supabase
    .from("company_scores")
    .select("slug, last_review_at, total_reviews")
    .order("total_reviews", { ascending: false });

  const companies = (data ?? []) as Pick<
    CompanyScore,
    "slug" | "last_review_at" | "total_reviews"
  >[];

  const companyUrls = companies.map((company) => ({
    url: `${BASE_URL}/company/${company.slug}`,
    lastModified: company.last_review_at
      ? new Date(company.last_review_at)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: companyPriority(company.total_reviews),
  }));

  const now = new Date();

  return [
    // ── High-traffic pages ──────────────────────────────
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/companies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/recent`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    // ── Feature / tool pages ────────────────────────────
    {
      url: `${BASE_URL}/insights`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/represent`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },

    // ── Resource / info pages ───────────────────────────
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/help`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/guidelines`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/advertisers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },

    // ── Legal ───────────────────────────────────────────
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/my-information`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },

    // ── Company pages (dynamic, ordered by review count) ─
    ...companyUrls,
  ];
}
