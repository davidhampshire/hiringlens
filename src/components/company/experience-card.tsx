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
            <p className="text-xs font-medium text-muted-foreground">Tip for candidates:</p>
            <p className="mt-0.5 text-sm">&ldquo;{interview.candidate_tip}&rdquo;</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex justify-end">
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
