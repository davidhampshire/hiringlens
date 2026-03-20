"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/shared/company-logo";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RealityScoreBadge } from "@/components/company/reality-score-badge";
import { RatingsBreakdown } from "@/components/company/ratings-breakdown";
import { cn, formatScore, getScoreColor, getScoreBgColor, formatRelativeDate } from "@/lib/utils";
import type { CompanyScore } from "@/types";

interface CompanyCardProps {
  company: CompanyScore;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/company/${company.slug}`}>
          <Card className="group gap-0 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <CompanyLogo
                  name={company.name}
                  logoUrl={company.logo_url}
                  size="xl"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-medium group-hover:text-primary">
                    {company.name}
                  </h3>
                  {company.industry && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {company.industry}
                    </p>
                  )}
                  {company.location && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {company.location}
                    </p>
                  )}
                </div>

                {/* Reality Score */}
                <div
                  className={cn(
                    "flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg border",
                    getScoreBgColor(company.reality_score)
                  )}
                >
                  <span
                    className={cn(
                      "text-lg font-bold leading-none",
                      getScoreColor(company.reality_score)
                    )}
                  >
                    {formatScore(company.reality_score)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-normal">
                  {company.total_reviews}{" "}
                  {company.total_reviews === 1 ? "review" : "reviews"}
                </Badge>
                {company.avg_duration_days && (
                  <Badge variant="outline" className="text-xs font-normal">
                    ~{Math.round(company.avg_duration_days)} days
                  </Badge>
                )}
                {company.last_review_at && (
                  <span className="ml-auto text-xs text-muted-foreground/60">
                    {formatRelativeDate(company.last_review_at)}
                  </span>
                )}
                {company.website_url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(
                        company.website_url!,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className={cn(
                      "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary",
                      !company.last_review_at && "ml-auto"
                    )}
                    title="Company website"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Website
                  </button>
                )}
              </div>
            </div>
          </Card>
        </Link>
      </HoverCardTrigger>

      {/* Hover preview — hidden on mobile, visible on lg+ */}
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={8}
        className="hidden w-72 lg:block"
      >
        <div>
          <div className="flex flex-col items-center gap-3">
            {/* Animated score ring */}
            <RealityScoreBadge
              score={company.reality_score}
              totalReviews={company.total_reviews ?? 0}
              size="sm"
            />

            {/* Ratings breakdown bars */}
            <div className="w-full border-t pt-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Ratings Breakdown
              </p>
              <RatingsBreakdown
                avgCommunication={company.avg_communication}
                avgProfessionalism={company.avg_professionalism}
                avgClarity={company.avg_clarity}
                avgFairness={company.avg_fairness}
                compact
                animate
              />
            </div>

            {/* View link */}
            <Link
              href={`/company/${company.slug}`}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              View full profile →
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
