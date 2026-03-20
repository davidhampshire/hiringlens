import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { CompanyScore } from "@/types";

export const metadata: Metadata = {
  title: "Accountability Index | HiringLens",
  description:
    "Ranking companies by how they treat candidates — ghosting rates, reality scores, unpaid tasks, and more. Based entirely on real interview experiences.",
};

export const revalidate = 3600;

const MIN_REVIEWS = 3;

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [
    { data: mostGhosted },
    { data: worstScores },
    { data: mostUnpaid },
    { data: mostNoFeedback },
    { data: bestScores },
    { data: bestCommunication },
    { data: fastest },
    { data: mostFair },
  ] = await Promise.all([
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("pct_ghosted", "is", null)
      .gt("pct_ghosted", 0)
      .order("pct_ghosted", { ascending: false })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("reality_score", "is", null)
      .order("reality_score", { ascending: true })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("pct_unpaid_task", "is", null)
      .gt("pct_unpaid_task", 0)
      .order("pct_unpaid_task", { ascending: false })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("pct_no_feedback", "is", null)
      .gt("pct_no_feedback", 0)
      .order("pct_no_feedback", { ascending: false })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("reality_score", "is", null)
      .order("reality_score", { ascending: false })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("avg_communication", "is", null)
      .order("avg_communication", { ascending: false })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("avg_duration_days", "is", null)
      .order("avg_duration_days", { ascending: true })
      .limit(10),
    supabase
      .from("company_scores")
      .select("*")
      .gte("total_reviews", MIN_REVIEWS)
      .not("avg_fairness", "is", null)
      .order("avg_fairness", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Accountability Index" },
        ]}
      />

      {/* Page header */}
      <div className="mb-10 mt-2">
        <h1 className="text-5xl font-medium sm:text-6xl">
          Accountability <span className="text-foreground/25">Index</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ranking companies by how they treat candidates. Real experiences, no PR spin.
        </p>
      </div>

      <LeaderboardTabs
        shame={{
          mostGhosted: (mostGhosted ?? []) as CompanyScore[],
          worstScores: (worstScores ?? []) as CompanyScore[],
          mostUnpaid: (mostUnpaid ?? []) as CompanyScore[],
          mostNoFeedback: (mostNoFeedback ?? []) as CompanyScore[],
        }}
        fame={{
          bestScores: (bestScores ?? []) as CompanyScore[],
          bestCommunication: (bestCommunication ?? []) as CompanyScore[],
          fastest: (fastest ?? []) as CompanyScore[],
          mostFair: (mostFair ?? []) as CompanyScore[],
        }}
      />

      {/* Bottom CTA */}
      <div className="mt-12 rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] px-6 py-8 text-center">
        <p className="text-base font-medium">
          Had an interview experience? Add it to the index.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Every review makes these rankings more accurate and helps future candidates make better
          decisions.
        </p>
        <a
          href="/submit"
          className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Share Your Experience
        </a>
      </div>
    </div>
  );
}
