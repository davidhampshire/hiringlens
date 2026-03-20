import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { RecentPostsList } from "@/components/recent/recent-posts-list";
import { AdPlaceholder } from "@/components/shared/ad-placeholder";
import { PromoBanner } from "@/components/shared/promo-banner";
import { CompanyPromo } from "@/components/shared/company-promo";
import type { Interview } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

export const metadata: Metadata = {
  title: "All Reviews",
  description:
    "Browse every interview review shared by candidates across all industries and companies. Filter by outcome, industry, seniority, and more.",
  alternates: {
    canonical: `${siteUrl}/recent`,
  },
};

export const revalidate = 300; // 5 min ISR

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string; industry: string | null; logo_url: string | null; website_url: string | null } | null;
};

export default async function RecentPostsPage() {
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("interviews")
    .select("*, companies(name, slug, industry, logo_url, website_url)", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(30);

  const interviews = (data ?? []) as unknown as InterviewWithCompany[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-in-view mb-8">
        <h1 className="text-5xl font-medium sm:text-6xl">
          All <span className="text-foreground/25">Reviews</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse every interview review shared by candidates across all
          companies and industries.
        </p>
      </div>

      <AdPlaceholder variant="leaderboard" className="mb-6" />

      <div className="animate-in-view-d1">
        <RecentPostsList
          initialPosts={interviews}
          totalCount={count ?? 0}
        />
      </div>

      <div className="mt-10">
        <CompanyPromo variant="reviews" />
      </div>

      <div className="mt-6">
        <PromoBanner />
      </div>

    </div>
  );
}
