import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdPlaceholder } from "@/components/shared/ad-placeholder";
import { PromoBanner } from "@/components/shared/promo-banner";
import { InsightsGrid, type IndustryStats } from "@/components/insights/insights-grid";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

export const metadata: Metadata = {
  title: "Industry Insights",
  description:
    "See how different industries compare on interview practices. Average stages, duration, ghosting rates, and more.",
  alternates: {
    canonical: `${siteUrl}/insights`,
  },
};

export const revalidate = 3600; // 1 hour ISR

export default async function InsightsPage() {
  const supabase = await createClient();

  const { data: scores } = await supabase
    .from("company_scores")
    .select("*")
    .gt("total_reviews", 0);

  // Aggregate by industry
  const industryMap = new Map<string, IndustryStats>();

  for (const row of scores ?? []) {
    const industry = row.industry ?? "Other";
    const existing = industryMap.get(industry);

    if (!existing) {
      industryMap.set(industry, {
        industry,
        companies: 1,
        totalReviews: row.total_reviews,
        avgStages: row.avg_stages,
        avgDuration: row.avg_duration_days,
        avgScore: row.reality_score,
        ghostingRate: row.pct_ghosted,
        feedbackRate: row.pct_no_feedback != null ? 100 - row.pct_no_feedback : null,
        unpaidTaskRate: row.pct_unpaid_task,
      });
    } else {
      existing.companies += 1;
      existing.totalReviews += row.total_reviews;

      // Running average
      const n = existing.companies;
      if (row.avg_stages != null) {
        existing.avgStages =
          existing.avgStages != null
            ? existing.avgStages + (row.avg_stages - existing.avgStages) / n
            : row.avg_stages;
      }
      if (row.avg_duration_days != null) {
        existing.avgDuration =
          existing.avgDuration != null
            ? existing.avgDuration + (row.avg_duration_days - existing.avgDuration) / n
            : row.avg_duration_days;
      }
      if (row.reality_score != null) {
        existing.avgScore =
          existing.avgScore != null
            ? existing.avgScore + (row.reality_score - existing.avgScore) / n
            : row.reality_score;
      }
      if (row.pct_ghosted != null) {
        existing.ghostingRate =
          existing.ghostingRate != null
            ? existing.ghostingRate + (row.pct_ghosted - existing.ghostingRate) / n
            : row.pct_ghosted;
      }
      if (row.pct_no_feedback != null) {
        const feedbackPct = 100 - row.pct_no_feedback;
        existing.feedbackRate =
          existing.feedbackRate != null
            ? existing.feedbackRate + (feedbackPct - existing.feedbackRate) / n
            : feedbackPct;
      }
      if (row.pct_unpaid_task != null) {
        existing.unpaidTaskRate =
          existing.unpaidTaskRate != null
            ? existing.unpaidTaskRate + (row.pct_unpaid_task - existing.unpaidTaskRate) / n
            : row.pct_unpaid_task;
      }
    }
  }

  const industries = Array.from(industryMap.values()).sort(
    (a, b) => b.totalReviews - a.totalReviews
  );

  /* Compute highlights */
  const withScores = industries.filter((i) => i.avgScore != null);
  const bestIndustry = withScores.length > 0
    ? withScores.reduce((best, i) => (i.avgScore! > best.avgScore! ? i : best))
    : null;
  const totalReviews = industries.reduce((sum, i) => sum + i.totalReviews, 0);
  const totalCompanies = industries.reduce((sum, i) => sum + i.companies, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="animate-in-view mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
          Industry <span className="text-foreground/25">Insights</span>
        </h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          See how different industries compare on interview practices based on
          real candidate experiences.
        </p>
      </div>

      {/* Summary highlights */}
      {industries.length > 0 && (
        <div className="animate-in-view-d1 mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{industries.length}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Industries
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{totalCompanies}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Companies
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{totalReviews}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Reviews
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            {bestIndustry ? (
              <>
                <p className="text-2xl font-bold text-emerald-600">
                  {Math.round(bestIndustry.avgScore!)}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Best: {bestIndustry.industry}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">-</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Best Industry
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <AdPlaceholder variant="leaderboard" className="mb-6" />

      {industries.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Not enough data yet. Industry insights will appear as more reviews are
          submitted.
        </div>
      ) : (
        <>
          <InsightsGrid industries={industries} />

          {/* Cross-links */}
          <div className="animate-in-view mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href="/companies"
              className="group rounded-lg border p-5 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <h3 className="font-bold group-hover:text-primary">Browse Company Directory</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore all rated companies and their Reality Scores.
              </p>
            </Link>
            <Link
              href="/compare"
              className="group rounded-lg border p-5 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <h3 className="font-bold group-hover:text-primary">Compare Companies</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Put companies side by side to see how they stack up.
              </p>
            </Link>
          </div>

          {/* Promo */}
          <div className="animate-in-view mt-8">
            <PromoBanner />
          </div>
        </>
      )}

    </div>
  );
}
