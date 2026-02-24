"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { FlagReportDialog } from "@/components/shared/flag-report-dialog";
import {
  OUTCOME_LABELS,
  SENIORITY_LABELS,
  INTERVIEW_TYPE_LABELS,
} from "@/lib/constants";
import type { Interview } from "@/types";

interface ExperienceCardProps {
  interview: Interview;
}

export function ExperienceCard({ interview }: ExperienceCardProps) {
  const [vote, setVote] = useState<"helpful" | "unhelpful" | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [unhelpfulCount, setUnhelpfulCount] = useState(0);

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

  function handleVote(type: "helpful" | "unhelpful") {
    if (vote === type) {
      // Undo vote
      if (type === "helpful") setHelpfulCount((c) => c - 1);
      else setUnhelpfulCount((c) => c - 1);
      setVote(null);
    } else {
      // Switch or new vote
      if (vote === "helpful") setHelpfulCount((c) => c - 1);
      if (vote === "unhelpful") setUnhelpfulCount((c) => c - 1);
      if (type === "helpful") setHelpfulCount((c) => c + 1);
      else setUnhelpfulCount((c) => c + 1);
      setVote(type);
    }

    // TODO: Persist to Supabase when interview_votes table is ready
  }

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
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
          {!interview.received_feedback && (
            <Badge variant="secondary" className="text-xs font-normal">
              No feedback
            </Badge>
          )}
        </div>

        {/* Comments */}
        {interview.overall_comments && (
          <p className="mt-3 text-sm text-muted-foreground">
            {interview.overall_comments}
          </p>
        )}

        {/* Tip */}
        {interview.candidate_tip && (
          <div className="mt-3 rounded-md bg-muted/30 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">
              Tip for candidates:
            </p>
            <p className="mt-0.5 text-sm">
              &ldquo;{interview.candidate_tip}&rdquo;
            </p>
          </div>
        )}

        {/* Actions — voting + report */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          {/* Helpfulness voting */}
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs text-muted-foreground">
              Helpful?
            </span>
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
          </div>

          <FlagReportDialog interviewId={interview.id}>
            <button className="text-xs text-muted-foreground hover:text-foreground">
              Report
            </button>
          </FlagReportDialog>
        </div>
      </div>
    </Card>
  );
}
