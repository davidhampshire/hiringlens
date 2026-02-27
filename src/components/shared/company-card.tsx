"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/shared/company-logo";
import { cn, formatScore, getScoreColor, getScoreBgColor } from "@/lib/utils";
import type { CompanyScore } from "@/types";

interface CompanyCardProps {
  company: CompanyScore;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/company/${company.slug}`}>
      <Card className="group gap-0 p-0 transition-all hover:shadow-md">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <CompanyLogo
              name={company.name}
              logoUrl={company.logo_url}
              size="xl"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold group-hover:text-primary">
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
              <span className={cn("text-lg font-bold leading-none", getScoreColor(company.reality_score))}>
                {formatScore(company.reality_score)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {company.total_reviews} {company.total_reviews === 1 ? "review" : "reviews"}
            </Badge>
            {company.avg_duration_days && (
              <Badge variant="outline" className="text-xs font-normal">
                ~{Math.round(company.avg_duration_days)} days
              </Badge>
            )}
            {company.website_url && (
              <a
                href={company.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                title="Company website"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Website
              </a>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
