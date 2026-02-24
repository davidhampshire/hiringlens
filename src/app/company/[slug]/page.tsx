import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RealityScoreBadge } from "@/components/company/reality-score-badge";
import { RatingsBreakdown } from "@/components/company/ratings-breakdown";
import { ProcessTimeline } from "@/components/company/process-timeline";
import { RedFlagIndicators } from "@/components/company/red-flag-indicators";
import { CandidateTips } from "@/components/company/candidate-tips";
import { ExperienceList } from "@/components/company/experience-list";
import type { CompanyScore, Interview } from "@/types";

export const revalidate = 3600;

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("company_scores")
      .select("slug")
      .order("total_reviews", { ascending: false })
      .limit(50);

    return data?.map(({ slug }: { slug: string }) => ({ slug })) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("company_scores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!company) {
    return { title: "Company Not Found" };
  }

  const c = company as CompanyScore;

  return {
    title: `${c.name} Interview Experience`,
    description: `Read ${c.total_reviews} interview experiences at ${c.name}. Reality Score: ${c.reality_score ? Math.round(c.reality_score) : "N/A"}/100. See ratings, process timeline, and candidate tips.`,
    openGraph: {
      title: `${c.name} Interview Experience | HiringLens`,
      description: `${c.total_reviews} real interview reviews. Reality Score: ${c.reality_score ? Math.round(c.reality_score) : "N/A"}/100.`,
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch company scores
  const { data: company } = await supabase
    .from("company_scores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!company) notFound();

  const c = company as CompanyScore;

  // Fetch interviews (RLS limits to approved only)
  const { data: interviewData, count } = await supabase
    .from("interviews")
    .select("*", { count: "exact" })
    .eq("company_id", c.company_id)
    .order("created_at", { ascending: false })
    .limit(10);

  const interviews = (interviewData ?? []) as Interview[];

  // Extract tips
  const tips = interviews
    .map((i) => i.candidate_tip)
    .filter((t): t is string => !!t)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Company header */}
      <div className="mb-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{c.name}</h1>
          {c.industry && (
            <span className="text-sm text-muted-foreground">{c.industry}</span>
          )}
        </div>
        {c.location && (
          <p className="mt-1 text-sm text-muted-foreground">{c.location}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <RealityScoreBadge
            score={c.reality_score}
            totalReviews={c.total_reviews}
          />

          <Separator />

          <RatingsBreakdown
            avgProfessionalism={c.avg_professionalism}
            avgCommunication={c.avg_communication}
            avgClarity={c.avg_clarity}
            avgFairness={c.avg_fairness}
          />

          <Separator />

          <ProcessTimeline
            avgStages={c.avg_stages}
            avgDurationDays={c.avg_duration_days}
            totalReviews={c.total_reviews}
          />

          <RedFlagIndicators
            pctGhosted={c.pct_ghosted}
            pctUnpaidTask={c.pct_unpaid_task}
            pctExceededTimeline={c.pct_exceeded_timeline}
            pctNoFeedback={c.pct_no_feedback}
            totalReviews={c.total_reviews}
          />

          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href={`/submit?company=${encodeURIComponent(c.name)}`}>
                Share Your Experience
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          <CandidateTips tips={tips} />

          {tips.length > 0 && <Separator />}

          <ExperienceList
            companyId={c.company_id}
            initialInterviews={interviews}
            totalCount={count ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
