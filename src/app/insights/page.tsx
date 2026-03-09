import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdPlaceholder } from "@/components/shared/ad-placeholder";
import { PromoBanner } from "@/components/shared/promo-banner";

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

interface IndustryStats {
  industry: string;
  companies: number;
  totalReviews: number;
  avgStages: number | null;
  avgDuration: number | null;
  avgScore: number | null;
  ghostingRate: number | null;
  feedbackRate: number | null;
  unpaidTaskRate: number | null;
}

function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StatRow({
  label,
  value,
  suffix = "",
  barValue,
  barMax = 100,
  barColor = "bg-primary",
}: {
  label: string;
  value: string;
  suffix?: string;
  barValue?: number;
  barMax?: number;
  barColor?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}
          {suffix}
        </span>
      </div>
      {barValue !== undefined && (
        <ProgressBar value={barValue} max={barMax} color={barColor} />
      )}
    </div>
  );
}

/* Stagger delay index → class */
const STAGGER = [
  "animate-in-view",
  "animate-in-view-d1",
  "animate-in-view-d2",
  "animate-in-view-d3",
  "animate-in-view-d4",
  "animate-in-view-d5",
];

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
  const worstIndustry = withScores.length > 1
    ? withScores.reduce((worst, i) => (i.avgScore! < worst.avgScore! ? i : worst))
    : null;
  const totalReviews = industries.reduce((sum, i) => sum + i.totalReviews, 0);
  const totalCompanies = industries.reduce((sum, i) => sum + i.companies, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="animate-in-view mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Card
                key={ind.industry}
                className={`gap-0 p-0 transition-shadow hover:shadow-md ${STAGGER[Math.min(i, STAGGER.length - 1)]}`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{ind.industry}</h3>
                    {ind.avgScore != null && (
                      <Badge
                        className={
                          ind.avgScore >= 75
                            ? "bg-emerald-100 text-emerald-700"
                            : ind.avgScore >= 50
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }
                      >
                        {Math.round(ind.avgScore)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ind.companies} {ind.companies === 1 ? "company" : "companies"} &middot;{" "}
                    {ind.totalReviews} {ind.totalReviews === 1 ? "review" : "reviews"}
                  </p>

                  <div className="mt-4 space-y-3">
                    {ind.avgStages != null && (
                      <StatRow
                        label="Avg stages"
                        value={ind.avgStages.toFixed(1)}
                        barValue={ind.avgStages}
                        barMax={10}
                        barColor="bg-blue-500"
                      />
                    )}
                    {ind.avgDuration != null && (
                      <StatRow
                        label="Avg duration"
                        value={`${Math.round(ind.avgDuration)}`}
                        suffix=" days"
                        barValue={ind.avgDuration}
                        barMax={60}
                        barColor="bg-violet-500"
                      />
                    )}
                    {ind.ghostingRate != null && (
                      <StatRow
                        label="Ghosting rate"
                        value={`${Math.round(ind.ghostingRate)}`}
                        suffix="%"
                        barValue={ind.ghostingRate}
                        barColor="bg-rose-500"
                      />
                    )}
                    {ind.feedbackRate != null && (
                      <StatRow
                        label="Feedback rate"
                        value={`${Math.round(ind.feedbackRate)}`}
                        suffix="%"
                        barValue={ind.feedbackRate}
                        barColor="bg-emerald-500"
                      />
                    )}
                    {ind.unpaidTaskRate != null && (
                      <StatRow
                        label="Unpaid task rate"
                        value={`${Math.round(ind.unpaidTaskRate)}`}
                        suffix="%"
                        barValue={ind.unpaidTaskRate}
                        barColor="bg-amber-500"
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

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
