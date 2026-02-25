import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { RecentPostsList } from "@/components/recent/recent-posts-list";
import { AdPlaceholder } from "@/components/shared/ad-placeholder";
import type { Interview } from "@/types";

export const metadata: Metadata = {
  title: "All Interview Experiences",
  description:
    "Browse every interview experience shared by candidates across all industries and companies. Filter by outcome, industry, seniority, and more.",
};

export const revalidate = 300; // 5 min ISR

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string; industry: string | null; logo_url: string | null } | null;
};

export default async function RecentPostsPage() {
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("interviews")
    .select("*, companies(name, slug, industry, logo_url)", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(30);

  const interviews = (data ?? []) as unknown as InterviewWithCompany[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-in-view mb-8">
        <h1 className="text-2xl font-bold">All Interview Experiences</h1>
        <p className="mt-2 text-muted-foreground">
          Browse every interview experience shared by candidates across all
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
    </div>
  );
}
