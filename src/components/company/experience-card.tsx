"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/star-rating";
import { FlagReportDialog } from "@/components/shared/flag-report-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  OUTCOME_LABELS,
  SENIORITY_LABELS,
  INTERVIEW_TYPE_LABELS,
  RATING_LABELS,
} from "@/lib/constants";
import { useVotes } from "@/hooks/use-votes";
import { CompanyLogo } from "@/components/shared/company-logo";
import type { Interview } from "@/types";

interface ExperienceCardProps {
  interview: Interview;
  companyName?: string;
  companySlug?: string;
  companyLogoUrl?: string | null;
}

/* ── Rating Breakdown Grid ── */
function RatingBreakdown({ interview }: { interview: Interview }) {
  const ratings = [
    { key: "professionalism_rating" as const, value: interview.professionalism_rating },
    { key: "communication_rating" as const, value: interview.communication_rating },
    { key: "clarity_rating" as const, value: interview.clarity_rating },
    { key: "fairness_rating" as const, value: interview.fairness_rating },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {ratings.map(({ key, value }) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
        >
          <span className="text-xs text-muted-foreground">
            {RATING_LABELS[key]}
          </span>
          <StarRating rating={value} size="sm" showValue />
        </div>
      ))}
    </div>
  );
}

/* ── Full Experience Modal ── */
function ExperienceModal({
  interview,
  companyName,
  companySlug,
}: ExperienceCardProps) {
  const avgRating =
    (interview.professionalism_rating +
      interview.communication_rating +
      interview.clarity_rating +
      interview.fairness_rating) /
    4;

  const fullDate = new Date(interview.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
      {/* Header */}
      <div>
        {companyName && companySlug && (
          <Link
            href={`/company/${companySlug}`}
            className="mb-1 inline-block text-sm font-medium text-primary hover:underline"
          >
            {companyName}
          </Link>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold">{interview.role_title}</h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {interview.seniority && (
                <span>{SENIORITY_LABELS[interview.seniority]}</span>
              )}
              {interview.location && <span>{interview.location}</span>}
              <span>{fullDate}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StarRating rating={avgRating} size="md" showValue />
            <span className="text-xs text-muted-foreground">Overall</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {interview.outcome && (
          <Badge
            variant={interview.outcome === "offer" ? "default" : "secondary"}
            className="text-xs font-normal"
          >
            {OUTCOME_LABELS[interview.outcome]}
          </Badge>
        )}
        {interview.interview_type && (
          <Badge variant="outline" className="text-xs font-normal">
            {INTERVIEW_TYPE_LABELS[interview.interview_type]}
          </Badge>
        )}
        {interview.stages_count && (
          <Badge variant="outline" className="text-xs font-normal">
            {interview.stages_count} stages
          </Badge>
        )}
        {interview.total_duration_days && (
          <Badge variant="outline" className="text-xs font-normal">
            {interview.total_duration_days} days
          </Badge>
        )}
        {interview.ghosted && (
          <Badge variant="destructive" className="text-xs font-normal">
            Ghosted
          </Badge>
        )}
        {interview.unpaid_task && (
          <Badge variant="destructive" className="text-xs font-normal">
            Unpaid work
          </Badge>
        )}
        {interview.interviewer_late && (
          <Badge variant="destructive" className="text-xs font-normal">
            Interviewer late / unprepared
          </Badge>
        )}
        {interview.exceeded_timeline && (
          <Badge variant="destructive" className="text-xs font-normal">
            Exceeded timeline
          </Badge>
        )}
        {interview.received_feedback && (
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-50 text-xs font-normal text-emerald-700"
          >
            Received feedback
          </Badge>
        )}
        {!interview.received_feedback && (
          <Badge variant="secondary" className="text-xs font-normal">
            No feedback
          </Badge>
        )}
      </div>

      <Separator />

      {/* Rating Breakdown */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">Rating Breakdown</h4>
        <RatingBreakdown interview={interview} />
      </div>

      {/* Full Comments */}
      {interview.overall_comments && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-semibold">Experience Details</h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {interview.overall_comments}
            </p>
          </div>
        </>
      )}

      {/* Full Tip */}
      {interview.candidate_tip && (
        <div className="rounded-md bg-emerald-50/60 px-4 py-3">
          <h4 className="mb-1 text-sm font-semibold text-emerald-800">
            Tip for Candidates
          </h4>
          <p className="whitespace-pre-wrap text-sm text-emerald-900/80">
            &ldquo;{interview.candidate_tip}&rdquo;
          </p>
        </div>
      )}

      {/* Process Details */}
      {(interview.stages_count || interview.total_duration_days) && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-semibold">Process Details</h4>
            <div className="grid grid-cols-2 gap-3">
              {interview.stages_count && (
                <div className="rounded-md bg-muted/40 px-3 py-2 text-center">
                  <p className="text-lg font-bold">{interview.stages_count}</p>
                  <p className="text-xs text-muted-foreground">
                    Interview Stages
                  </p>
                </div>
              )}
              {interview.total_duration_days && (
                <div className="rounded-md bg-muted/40 px-3 py-2 text-center">
                  <p className="text-lg font-bold">
                    {interview.total_duration_days}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main Experience Card ── */
export function ExperienceCard({
  interview,
  companyName,
  companySlug,
  companyLogoUrl,
}: ExperienceCardProps) {
  const {
    userVote: vote,
    helpfulCount,
    unhelpfulCount,
    isAuthenticated,
    handleVote,
  } = useVotes(interview.id);
  const [modalOpen, setModalOpen] = useState(false);

  const avgRating =
    (interview.professionalism_rating +
      interview.communication_rating +
      interview.clarity_rating +
      interview.fairness_rating) /
    4;

  const date = new Date(interview.created_at).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <Card
        className="cursor-pointer gap-0 p-0 transition-all hover:shadow-md hover:ring-1 hover:ring-border"
        onClick={() => setModalOpen(true)}
      >
        <div className="p-5">
          {/* Company name + logo (shown on Recent Posts page) */}
          {companyName && companySlug && (
            <div className="mb-3 flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
              <CompanyLogo
                name={companyName}
                logoUrl={companyLogoUrl}
                size="sm"
              />
              <Link
                href={`/company/${companySlug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {companyName}
              </Link>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{interview.role_title}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {interview.seniority && (
                  <span>{SENIORITY_LABELS[interview.seniority]}</span>
                )}
                {interview.location && <span>{interview.location}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StarRating rating={avgRating} size="sm" showValue />
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {interview.outcome && (
              <Badge
                variant={
                  interview.outcome === "offer" ? "default" : "secondary"
                }
                className="text-xs font-normal"
              >
                {OUTCOME_LABELS[interview.outcome]}
              </Badge>
            )}
            {interview.interview_type && (
              <Badge variant="outline" className="text-xs font-normal">
                {INTERVIEW_TYPE_LABELS[interview.interview_type]}
              </Badge>
            )}
            {interview.stages_count && (
              <Badge variant="outline" className="text-xs font-normal">
                {interview.stages_count} stages
              </Badge>
            )}
            {interview.total_duration_days && (
              <Badge variant="outline" className="text-xs font-normal">
                {interview.total_duration_days} days
              </Badge>
            )}
            {interview.ghosted && (
              <Badge variant="destructive" className="text-xs font-normal">
                Ghosted
              </Badge>
            )}
            {interview.unpaid_task && (
              <Badge variant="destructive" className="text-xs font-normal">
                Unpaid work
              </Badge>
            )}
            {!interview.received_feedback && (
              <Badge variant="secondary" className="text-xs font-normal">
                No feedback
              </Badge>
            )}
          </div>

          {/* Comments (truncated) */}
          {interview.overall_comments && (
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {interview.overall_comments}
            </p>
          )}

          {/* Tip (truncated) */}
          {interview.candidate_tip && (
            <div className="mt-3 rounded-md bg-muted/30 px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">
                Tip for candidates:
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm">
                &ldquo;{interview.candidate_tip}&rdquo;
              </p>
            </div>
          )}

          {/* Actions — voting + report */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="mt-3 flex items-center justify-between border-t pt-3" onClick={(e) => e.stopPropagation()}>
            {/* Helpfulness voting */}
            <div className="flex items-center gap-1">
              <span className="mr-1 text-xs text-muted-foreground">
                Helpful?
              </span>
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleVote("helpful")}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                      vote === "helpful"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill={vote === "helpful" ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z M4 15h0a2 2 0 01-2-2V9a2 2 0 012-2h0"
                      />
                    </svg>
                    Yes{helpfulCount > 0 && ` (${helpfulCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote("unhelpful")}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                      vote === "unhelpful"
                        ? "bg-red-100 text-red-700"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill={vote === "unhelpful" ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z M20 2h0a2 2 0 012 2v4a2 2 0 01-2 2h0"
                      />
                    </svg>
                    No{unhelpfulCount > 0 && ` (${unhelpfulCount})`}
                  </button>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z M4 15h0a2 2 0 01-2-2V9a2 2 0 012-2h0" />
                    </svg>
                    {helpfulCount}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z M20 2h0a2 2 0 012 2v4a2 2 0 01-2 2h0" />
                    </svg>
                    {unhelpfulCount}
                  </span>
                  <Link
                    href="/sign-in"
                    className="ml-1 text-xs text-primary hover:underline"
                  >
                    Sign in to vote
                  </Link>
                </>
              )}
            </div>

            <FlagReportDialog interviewId={interview.id}>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                Report
              </button>
            </FlagReportDialog>
          </div>
        </div>
      </Card>

      {/* Full Experience Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Experience</DialogTitle>
            <DialogDescription>
              Full details for the {interview.role_title} interview
              {companyName ? ` at ${companyName}` : ""}
            </DialogDescription>
          </DialogHeader>
          <ExperienceModal
            interview={interview}
            companyName={companyName}
            companySlug={companySlug}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
