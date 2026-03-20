"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyLogo } from "@/components/shared/company-logo";
import Link from "next/link";
import type { CompanyScore } from "@/types";

const MIN_REVIEWS = 3;

interface LeaderboardData {
  shame: {
    mostGhosted: CompanyScore[];
    worstScores: CompanyScore[];
    mostUnpaid: CompanyScore[];
    mostNoFeedback: CompanyScore[];
  };
  fame: {
    bestScores: CompanyScore[];
    bestCommunication: CompanyScore[];
    fastest: CompanyScore[];
    mostFair: CompanyScore[];
  };
}

function RankRow({
  rank,
  company,
  metric,
  metricLabel,
  variant,
}: {
  rank: number;
  company: CompanyScore;
  metric: string;
  metricLabel: string;
  variant: "shame" | "fame";
}) {
  const metricColor =
    variant === "shame"
      ? "text-red-500 dark:text-red-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <Link href={`/company/${company.slug}`}>
      <div className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
        <span className="w-5 shrink-0 text-center text-sm font-medium tabular-nums text-muted-foreground/50">
          {rank}
        </span>
        <CompanyLogo name={company.name} logoUrl={company.logo_url} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{company.name}</p>
          <p className="text-xs text-muted-foreground">
            {company.industry ? `${company.industry} · ` : ""}
            {company.total_reviews} review{company.total_reviews !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-sm font-semibold tabular-nums ${metricColor}`}>{metric}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {metricLabel}
          </p>
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({
  title,
  description,
  icon,
  companies,
  renderMetric,
  variant,
}: {
  title: string;
  description: string;
  icon: string;
  companies: CompanyScore[];
  renderMetric: (c: CompanyScore) => { metric: string; metricLabel: string };
  variant: "shame" | "fame";
}) {
  const borderColor =
    variant === "shame"
      ? "border-red-200/60 dark:border-red-900/30"
      : "border-emerald-200/60 dark:border-emerald-900/30";
  const headerBg =
    variant === "shame"
      ? "bg-red-50/60 dark:bg-red-950/20"
      : "bg-emerald-50/60 dark:bg-emerald-950/20";

  return (
    <div className={`overflow-hidden rounded-xl border bg-card ${borderColor}`}>
      <div className={`border-b px-4 py-3.5 ${headerBg} ${borderColor}`}>
        <h3 className="text-sm font-semibold">
          {icon} {title}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {companies.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          Not enough data yet — submit your experience to help build this list.
        </p>
      ) : (
        <div className="divide-y">
          {companies.slice(0, 5).map((company, i) => {
            const { metric, metricLabel } = renderMetric(company);
            return (
              <RankRow
                key={company.company_id}
                rank={i + 1}
                company={company}
                metric={metric}
                metricLabel={metricLabel}
                variant={variant}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LeaderboardTabs({ shame, fame }: LeaderboardData) {
  return (
    <Tabs defaultValue="shame">
      <TabsList className="mb-8 grid w-full grid-cols-2 sm:inline-flex sm:w-auto">
        <TabsTrigger value="shame" className="gap-1.5">
          <span>⚠️</span> Hall of Shame
        </TabsTrigger>
        <TabsTrigger value="fame" className="gap-1.5">
          <span>🏆</span> Hall of Fame
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shame" className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Companies ranked by the experiences candidates shared — from ghosting to unpaid tasks.
          All data comes from real reviews. Minimum {MIN_REVIEWS} reviews to qualify.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <CategoryCard
            title="Most Likely to Ghost"
            description="Candidates never heard back after interviewing"
            icon="👻"
            companies={shame.mostGhosted}
            variant="shame"
            renderMetric={(c) => ({
              metric: `${Math.round(c.pct_ghosted ?? 0)}%`,
              metricLabel: "ghosted",
            })}
          />
          <CategoryCard
            title="Lowest Reality Scores"
            description="Biggest gap between company image and interview reality"
            icon="📉"
            companies={shame.worstScores}
            variant="shame"
            renderMetric={(c) => ({
              metric: `${Math.round(c.reality_score ?? 0)}/100`,
              metricLabel: "reality score",
            })}
          />
          <CategoryCard
            title="Most Unpaid Task Requests"
            description="Companies that asked candidates to complete unpaid work"
            icon="📋"
            companies={shame.mostUnpaid}
            variant="shame"
            renderMetric={(c) => ({
              metric: `${Math.round(c.pct_unpaid_task ?? 0)}%`,
              metricLabel: "unpaid tasks",
            })}
          />
          <CategoryCard
            title="Left Candidates Without Feedback"
            description="Rejected candidates with no explanation given"
            icon="🔇"
            companies={shame.mostNoFeedback}
            variant="shame"
            renderMetric={(c) => ({
              metric: `${Math.round(c.pct_no_feedback ?? 0)}%`,
              metricLabel: "no feedback",
            })}
          />
        </div>
      </TabsContent>

      <TabsContent value="fame" className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Companies that candidates say treated them with respect, communicated clearly, and ran a
          fair process — even when the outcome was a rejection. Minimum {MIN_REVIEWS} reviews to
          qualify.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <CategoryCard
            title="Highest Reality Scores"
            description="Companies that live up to their reputation in hiring"
            icon="⭐"
            companies={fame.bestScores}
            variant="fame"
            renderMetric={(c) => ({
              metric: `${Math.round(c.reality_score ?? 0)}/100`,
              metricLabel: "reality score",
            })}
          />
          <CategoryCard
            title="Best Communication"
            description="Kept candidates informed and updated throughout"
            icon="💬"
            companies={fame.bestCommunication}
            variant="fame"
            renderMetric={(c) => ({
              metric: `${(c.avg_communication ?? 0).toFixed(1)}/5`,
              metricLabel: "communication",
            })}
          />
          <CategoryCard
            title="Fastest Hiring Process"
            description="Respected candidates' time with swift, clear decisions"
            icon="⚡"
            companies={fame.fastest}
            variant="fame"
            renderMetric={(c) => ({
              metric: `${Math.round(c.avg_duration_days ?? 0)}d`,
              metricLabel: "avg process",
            })}
          />
          <CategoryCard
            title="Most Fair & Transparent"
            description="Candidates rated the process as clear and fair"
            icon="⚖️"
            companies={fame.mostFair}
            variant="fame"
            renderMetric={(c) => ({
              metric: `${(c.avg_fairness ?? 0).toFixed(1)}/5`,
              metricLabel: "fairness",
            })}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
