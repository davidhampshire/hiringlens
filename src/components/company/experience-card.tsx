"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
  APPLICATION_SOURCE_LABELS,
  RECOMMEND_APPLYING_LABELS,
  JD_ACCURACY_LABELS,
} from "@/lib/constants";
import { useVotes } from "@/hooks/use-votes";
import { CompanyLogo } from "@/components/shared/company-logo";
import { InfoTooltip } from "@/components/ui/tooltip";
import type { Interview, CompanyResponse } from "@/types";

interface ExperienceCardProps {
  interview: Interview;
  companyName?: string;
  companySlug?: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  companyResponse?: CompanyResponse | null;
  // Controlled modal + navigation (supplied by parent list for prev/next)
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  positionLabel?: string; // e.g. "3 of 12"
}

/** Strip the ---FOLLOW_UP_DATA--- JSON block from comments */
function cleanComments(text: string | null): string | null {
  if (!text) return null;
  const idx = text.indexOf("---FOLLOW_UP_DATA---");
  if (idx === -1) return text;
  const cleaned = text.substring(0, idx).trim();
  return cleaned || null;
}

/** Check if an interview is "new" (posted within the last 7 days) */
function isNew(createdAt: string): boolean {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

/** Color classes for rating badge — 5 tiers for clear visual distinction */
function getRatingColors(rating: number) {
  if (rating >= 4.5) return {
    bg: "bg-emerald-100",
    ring: "ring-emerald-300/60",
    text: "text-emerald-800",
    sub: "text-emerald-700/70",
    star: "text-emerald-600",
  };
  if (rating >= 3.5) return {
    bg: "bg-emerald-50",
    ring: "ring-emerald-200/60",
    text: "text-emerald-700",
    sub: "text-emerald-600/70",
    star: "text-emerald-500",
  };
  if (rating >= 2.5) return {
    bg: "bg-amber-50",
    ring: "ring-amber-200/60",
    text: "text-amber-700",
    sub: "text-amber-600/70",
    star: "text-amber-500",
  };
  if (rating >= 1.5) return {
    bg: "bg-orange-50",
    ring: "ring-orange-200/60",
    text: "text-orange-700",
    sub: "text-orange-600/70",
    star: "text-orange-500",
  };
  return {
    bg: "bg-red-50",
    ring: "ring-red-200/60",
    text: "text-red-700",
    sub: "text-red-600/70",
    star: "text-red-500",
  };
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

interface ExperienceModalProps extends ExperienceCardProps {
  // inherits companyWebsiteUrl from ExperienceCardProps
  vote: "helpful" | "unhelpful" | null;
  helpfulCount: number;
  unhelpfulCount: number;
  isAuthenticated: boolean;
  handleVote: (type: "helpful" | "unhelpful") => void;
}

/* ── Full Experience Modal ── */
function ExperienceModal({
  interview,
  companyName,
  companySlug,
  companyLogoUrl,
  companyWebsiteUrl,
  companyResponse,
  vote,
  helpfulCount,
  unhelpfulCount,
  isAuthenticated,
  handleVote,
}: ExperienceModalProps) {
  const avgRating =
    (interview.professionalism_rating +
      interview.communication_rating +
      interview.clarity_rating +
      interview.fairness_rating) /
    4;

  const displayDateSource = interview.interview_date || interview.created_at;
  const fullDate = new Date(displayDateSource).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
      {/* Header — company logo + name, role title, overall rating */}
      <div>
        {companyName && companySlug && (
          <div className="mb-3 flex items-center gap-2.5">
            <CompanyLogo name={companyName} logoUrl={companyLogoUrl} websiteUrl={companyWebsiteUrl} size="md" />
            <Link
              href={`/company/${companySlug}`}
              className="text-base font-semibold text-primary hover:underline"
            >
              {companyName}
            </Link>
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{interview.role_title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              by {interview.display_name || "Anonymous"}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {interview.seniority && (
                <span>{SENIORITY_LABELS[interview.seniority]}</span>
              )}
              {interview.location && <span>{interview.location}</span>}
              <span>{fullDate}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
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
        {interview.salary_range && interview.salary_range !== "Prefer not to say" && (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-xs font-normal text-emerald-700">
            {interview.salary_range}
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
        {interview.application_source && (
          <Badge variant="outline" className="text-xs font-normal">
            via {APPLICATION_SOURCE_LABELS[interview.application_source] ?? interview.application_source}
          </Badge>
        )}
        {interview.recommend_applying && (
          <Badge
            variant="outline"
            className={`text-xs font-normal ${
              interview.recommend_applying === "yes"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : interview.recommend_applying === "maybe"
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {interview.recommend_applying === "yes"
              ? "Recommends applying"
              : interview.recommend_applying === "maybe"
                ? "Maybe recommend"
                : "Doesn't recommend"}
          </Badge>
        )}
        {interview.jd_accuracy && interview.jd_accuracy !== "yes" && (
          <Badge
            variant="outline"
            className={`text-xs font-normal ${
              interview.jd_accuracy === "somewhat"
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            JD {interview.jd_accuracy === "somewhat" ? "somewhat accurate" : "inaccurate"}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Rating Breakdown */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <h4 className="text-sm font-semibold">Rating Breakdown</h4>
          <InfoTooltip content="Ratings across four dimensions: Professionalism, Communication, Clarity of process, and Fairness of assessment." />
        </div>
        <RatingBreakdown interview={interview} />
      </div>

      {/* Process Details — moved up, right after ratings */}
      {(interview.stages_count || interview.total_duration_days) && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-semibold">Process Details</h4>
            <div className="grid grid-cols-2 gap-3">
              {interview.stages_count && (
                <div className="rounded-md bg-muted/40 px-3 py-3 text-center">
                  <p className="text-2xl font-medium">{interview.stages_count}</p>
                  <p className="text-xs text-muted-foreground">Interview Stages</p>
                </div>
              )}
              {interview.total_duration_days && (
                <div className="rounded-md bg-muted/40 px-3 py-3 text-center">
                  <p className="text-2xl font-medium">{interview.total_duration_days}</p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Full Comments */}
      {cleanComments(interview.overall_comments) && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-semibold">Experience Details</h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {cleanComments(interview.overall_comments)}
            </p>
          </div>
        </>
      )}

      {/* Interview Questions */}
      {interview.interview_questions && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-semibold">Questions Asked</h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {interview.interview_questions}
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

      {/* Company Response */}
      {companyResponse && (
        <>
          <Separator />
          <div className="rounded-md border border-blue-200 bg-blue-50/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                Company Response
              </Badge>
              <svg className="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-blue-600/70">Verified Representative</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-blue-900/80">
              {companyResponse.body}
            </p>
          </div>
        </>
      )}

      {/* Bottom actions — votes + share */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-muted-foreground">Helpful?</span>
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
                <svg className="h-3.5 w-3.5" fill={vote === "helpful" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z M4 15h0a2 2 0 01-2-2V9a2 2 0 012-2h0" />
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
                <svg className="h-3.5 w-3.5" fill={vote === "unhelpful" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z M20 2h0a2 2 0 012 2v4a2 2 0 01-2 2h0" />
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
              <Link href="/sign-in" className="ml-1 text-xs text-primary hover:underline">
                Sign in to vote
              </Link>
            </>
          )}
        </div>
        {/* Share */}
        <button
          type="button"
          onClick={() => {
            const url = window.location.href;
            if (navigator.share) {
              navigator.share({ title: `${interview.role_title} interview experience`, url }).catch(() => {});
            } else {
              navigator.clipboard.writeText(url).then(
                () => toast.success("Link copied!"),
                () => toast.error("Failed to copy link")
              );
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}

/* ── Main Experience Card ── */
export function ExperienceCard({
  interview,
  companyName,
  companySlug,
  companyLogoUrl,
  companyWebsiteUrl,
  companyResponse,
  isOpen,
  onOpenChange,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  positionLabel,
}: ExperienceCardProps) {
  const {
    userVote: vote,
    helpfulCount,
    unhelpfulCount,
    isAuthenticated,
    handleVote,
  } = useVotes(interview.id);
  const [modalOpen, setModalOpen] = useState(false);

  // Support both controlled (from parent list) and uncontrolled modes
  const controlled = isOpen !== undefined;
  const isDialogOpen = controlled ? isOpen! : modalOpen;
  const handleDialogOpenChange = (open: boolean) =>
    controlled ? onOpenChange?.(open) : setModalOpen(open);
  const handleCardClick = () =>
    controlled ? onOpenChange?.(true) : setModalOpen(true);

  const avgRating =
    (interview.professionalism_rating +
      interview.communication_rating +
      interview.clarity_rating +
      interview.fairness_rating) /
    4;

  const cardDateSource = interview.interview_date || interview.created_at;
  const date = new Date(cardDateSource).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

  const colors = getRatingColors(avgRating);

  return (
    <>
      <Card
        className="flex h-full cursor-pointer flex-col gap-0 p-0 transition-all hover:shadow-md hover:ring-1 hover:ring-border"
        onClick={handleCardClick}
      >
        <div className="flex flex-1 flex-col p-4">
          {/* Header — score aligns with company name */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Company name + logo (shown on All Experiences page) */}
              {companyName && companySlug && (
                <div className="mb-2 flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                  <CompanyLogo
                    name={companyName}
                    logoUrl={companyLogoUrl}
                    websiteUrl={companyWebsiteUrl}
                    size="md"
                  />
                  <Link
                    href={`/company/${companySlug}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {companyName}
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2">
                <p className="font-semibold">{interview.role_title}</p>
                {isNew(interview.created_at) && (
                  <Badge className="bg-blue-100 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">
                    New
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span>
                  by {interview.display_name || "Anonymous"}
                </span>
                {interview.seniority && (
                  <>
                    <span className="text-muted-foreground/40">&middot;</span>
                    <span>{SENIORITY_LABELS[interview.seniority]}</span>
                  </>
                )}
                {interview.department && (
                  <>
                    <span className="text-muted-foreground/40">&middot;</span>
                    <span>{interview.department}</span>
                  </>
                )}
                {interview.location && (
                  <>
                    <span className="text-muted-foreground/40">&middot;</span>
                    <span>{interview.location}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <div className={`flex items-center gap-1.5 rounded-xl px-2 py-1 ring-1 ${colors.bg} ${colors.ring}`}>
                <span className={`text-lg font-extrabold ${colors.text}`}>
                  {avgRating.toFixed(1)}
                </span>
                <div className="flex flex-col items-end">
                  <StarRating rating={avgRating} size="sm" />
                  <span className={`text-[10px] font-medium ${colors.sub}`}>
                    out of 5
                  </span>
                </div>
              </div>
              <span className={`text-xs text-muted-foreground ${companyName ? "mt-3" : "mt-1"}`}>{date}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
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
            {interview.salary_range && interview.salary_range !== "Prefer not to say" && (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-xs font-normal text-emerald-700">
                {interview.salary_range}
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
            {interview.recommend_applying && (
              <Badge
                variant="outline"
                className={`text-xs font-normal ${
                  interview.recommend_applying === "yes"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : interview.recommend_applying === "maybe"
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-red-300 bg-red-50 text-red-700"
                }`}
              >
                {interview.recommend_applying === "yes"
                  ? "Recommends"
                  : interview.recommend_applying === "maybe"
                    ? "Maybe"
                    : "Doesn't recommend"}
              </Badge>
            )}
            {interview.application_source && (
              <Badge variant="outline" className="text-xs font-normal">
                via {APPLICATION_SOURCE_LABELS[interview.application_source] ?? interview.application_source}
              </Badge>
            )}
          </div>

          {/* Comments (truncated) */}
          {cleanComments(interview.overall_comments) && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {cleanComments(interview.overall_comments)}
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

          {/* Company response */}
          {companyResponse && (
            <div className="mt-3 rounded-md border border-blue-200 bg-blue-50/50 px-3 py-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <Badge className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0">
                  Company Response
                </Badge>
                <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="line-clamp-2 text-xs text-blue-900/80">
                {companyResponse.body}
              </p>
            </div>
          )}

          {/* Actions — voting + report */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="mt-auto flex items-center justify-between border-t pt-3" onClick={(e) => e.stopPropagation()}>
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = window.location.origin + (companySlug ? `/company/${companySlug}` : "");
                  if (navigator.share) {
                    navigator.share({
                      title: `${interview.role_title} Interview${companyName ? ` at ${companyName}` : ""}`,
                      url,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(url).then(
                      () => toast.success("Link copied!"),
                      () => toast.error("Failed to copy link")
                    );
                  }
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
                title="Share"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <FlagReportDialog interviewId={interview.id}>
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  Report
                </button>
              </FlagReportDialog>
            </div>
          </div>
        </div>
      </Card>

      {/* Full Experience Modal */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Experience</DialogTitle>
            <DialogDescription>
              Full details for the {interview.role_title} interview
              {companyName ? ` at ${companyName}` : ""}
            </DialogDescription>
          </DialogHeader>

          {/* Prev / Next navigation */}
          {(hasPrev || hasNext) && (
            <div className="flex items-center justify-between border-b pb-3 -mt-1">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              {positionLabel && (
                <span className="text-xs text-muted-foreground">{positionLabel}</span>
              )}
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                Next
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <ExperienceModal
            interview={interview}
            companyName={companyName}
            companySlug={companySlug}
            companyLogoUrl={companyLogoUrl}
            companyWebsiteUrl={companyWebsiteUrl}
            companyResponse={companyResponse}
            vote={vote}
            helpfulCount={helpfulCount}
            unhelpfulCount={unhelpfulCount}
            isAuthenticated={isAuthenticated}
            handleVote={handleVote}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
