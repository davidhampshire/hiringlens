import type { Metadata } from "next";
import { Suspense } from "react";
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
import { ExperienceListSkeleton } from "@/components/company/company-page-skeleton";
import type { CompanyResponse } from "@/types";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ShareButton } from "@/components/shared/share-button";
import { CompanyLogo } from "@/components/shared/company-logo";
import { AdPlaceholder } from "@/components/shared/ad-placeholder";
import { TimelineComparison } from "@/components/company/timeline-comparison";
import { JumpToExperiences } from "@/components/company/jump-to-experiences";
import { WatchCompanyForm } from "@/components/company/watch-company-form";
import { buildCompanyJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getIndustryAverageDuration } from "@/lib/actions/interview";
import { formatRelativeDate } from "@/lib/utils";
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";
  const companyUrl = `${siteUrl}/company/${slug}`;

  return {
    title: `${c.name} Interview Experience`,
    description: `Read ${c.total_reviews} interview experiences at ${c.name}. Reality Score: ${c.reality_score ? Math.round(c.reality_score) : "N/A"}/100. See ratings, process timeline, and candidate tips.`,
    openGraph: {
      title: `${c.name} Interview Experience | HiringLens`,
      description: `${c.total_reviews} real interview reviews. Reality Score: ${c.reality_score ? Math.round(c.reality_score) : "N/A"}/100.`,
      url: companyUrl,
    },
    alternates: {
      canonical: companyUrl,
    },
  };
}

/* Async component that fetches interviews — wrapped in Suspense for streaming */
async function CompanyExperiences({ companyId }: { companyId: string }) {
  const supabase = await createClient();

  const { data: interviewData, count } = await supabase
    .from("interviews")
    .select("*", { count: "exact" })
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(10);

  const interviews = (interviewData ?? []) as Interview[];

  // Fetch published company responses for these interviews
  const interviewIds = interviews.map((i) => i.id);
  const { data: responseData } = interviewIds.length > 0
    ? await supabase
        .from("company_responses")
        .select("*")
        .eq("status", "published")
        .in("interview_id", interviewIds)
    : { data: [] };

  const companyResponses: Record<string, CompanyResponse> = {};
  for (const r of (responseData ?? []) as CompanyResponse[]) {
    companyResponses[r.interview_id] = r;
  }

  const tips = interviews
    .map((i) => i.candidate_tip)
    .filter((t): t is string => !!t)
    .slice(0, 5);

  return (
    <>
      <CandidateTips tips={tips} />
      {tips.length > 0 && <Separator />}
      <ExperienceList
        companyId={companyId}
        initialInterviews={interviews}
        totalCount={count ?? 0}
        companyResponses={companyResponses}
      />
    </>
  );
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

  // Fetch interviews for JSON-LD (lightweight — only need a few fields)
  const { data: interviewData } = await supabase
    .from("interviews")
    .select("*")
    .eq("company_id", c.company_id)
    .order("created_at", { ascending: false })
    .limit(5);

  const jsonLdInterviews = (interviewData ?? []) as Interview[];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";
  const jsonLd = buildCompanyJsonLd(c, jsonLdInterviews, slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Companies", url: `${siteUrl}/companies` },
    { name: c.name, url: `${siteUrl}/company/${slug}` },
  ]);

  // Fetch industry average for timeline comparison
  const industryAvgDuration = c.industry
    ? await getIndustryAverageDuration(c.industry)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="animate-in-view">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Companies", href: "/companies" },
            { label: c.name },
          ]}
        />
      </div>

      {/* Company header */}
      <div className="animate-in-view-d1 mb-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="shrink-0">
            <CompanyLogo
              name={c.name}
              logoUrl={c.logo_url}
              size="xl"
              className="sm:hidden"
            />
            <CompanyLogo
              name={c.name}
              logoUrl={c.logo_url}
              size="2xl"
              className="hidden sm:block"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-2xl font-medium leading-tight sm:text-4xl">{c.name}</h1>
              {c.industry && (
                <span className="text-sm text-muted-foreground">{c.industry}</span>
              )}
              <ShareButton
                title={`${c.name} Interview Experience | HiringLens`}
                text={`Check out interview experiences at ${c.name} on HiringLens`}
              />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
              {c.location && <span>{c.location}</span>}
              {c.website_url && (
                <a
                  href={c.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {new URL(c.website_url).hostname.replace(/^www\./, "")}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="animate-in-view-d2 space-y-6">
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

          {c.industry && (
            <TimelineComparison
              companyAvgDays={c.avg_duration_days}
              industryAvgDays={industryAvgDuration}
              industry={c.industry}
            />
          )}

          <RedFlagIndicators
            pctGhosted={c.pct_ghosted}
            pctUnpaidTask={c.pct_unpaid_task}
            pctExceededTimeline={c.pct_exceeded_timeline}
            pctNoFeedback={c.pct_no_feedback}
            totalReviews={c.total_reviews}
          />

          <Separator />

          {c.last_review_at && (
            <p className="text-xs text-muted-foreground">
              Last review: <span className="font-medium text-foreground">{formatRelativeDate(c.last_review_at)}</span>
            </p>
          )}

          <WatchCompanyForm companyId={c.company_id} companyName={c.name} />

          <AdPlaceholder variant="sidebar" />
        </aside>

        {/* Main content — streams in */}
        <div id="experiences" className="animate-in-view-d3 space-y-6">
          <Suspense fallback={<ExperienceListSkeleton />}>
            <CompanyExperiences companyId={c.company_id} />
          </Suspense>
        </div>
      </div>

      {/* Bottom CTAs — visible on all screens, after experiences */}
      <div className="mt-12 border-t pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/submit?company=${encodeURIComponent(c.name)}`}>
                Share Your Experience
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/company/${slug}/widget`}>
                Embed Widget
              </Link>
            </Button>
          </div>
          {/* Share CTA — drives virality */}
          <div className="rounded-lg border border-dashed border-primary/20 bg-primary/[0.03] p-4 sm:max-w-sm">
            <p className="text-sm font-medium">
              {c.total_reviews < 3
                ? "Be one of the first to review"
                : "Know someone who interviewed here?"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {c.total_reviews < 3
                ? `${c.name} only has ${c.total_reviews} ${c.total_reviews === 1 ? "review" : "reviews"}. Share this page to help build a fuller picture.`
                : "Share this page so they can add their experience and help other candidates."}
            </p>
            <ShareButton
              variant="cta"
              title={`${c.name} Interview Experience | HiringLens`}
              text={`Have you interviewed at ${c.name}? Share your experience on HiringLens to help other candidates know what to expect.`}
            />
          </div>
        </div>
      </div>

      {/* Floating mobile jump button */}
      <JumpToExperiences totalReviews={c.total_reviews} />
    </div>
  );
}
