"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  approveInterview,
  rejectInterview,
  deleteInterviewAdmin,
} from "@/lib/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Interview } from "@/types";

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string } | null;
};

interface AdminInterviewRowProps {
  interview: InterviewWithCompany;
  flagCount?: number;
  showActions?: boolean;
}

const OUTCOME_LABELS: Record<string, { label: string; className: string }> = {
  offer: { label: "Offer", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-rose-100 text-rose-700" },
  ghosted: { label: "Ghosted", className: "bg-amber-100 text-amber-700" },
  withdrew: { label: "Withdrew", className: "bg-gray-100 text-gray-700" },
  pending: { label: "Pending", className: "bg-blue-100 text-blue-700" },
};

export function AdminInterviewRow({
  interview,
  flagCount,
  showActions,
}: AdminInterviewRowProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionDone, setActionDone] = useState<"approved" | "rejected" | "deleted" | null>(null);

  async function handleApprove() {
    setIsApproving(true);
    try {
      await approveInterview(interview.id);
      setActionDone("approved");
      toast.success("Interview approved");
    } catch {
      toast.error("Failed to approve interview");
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject() {
    setIsRejecting(true);
    try {
      await rejectInterview(interview.id);
      setActionDone("rejected");
      toast.success("Interview rejected");
    } catch {
      toast.error("Failed to reject interview");
    } finally {
      setIsRejecting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteInterviewAdmin(interview.id);
      setActionDone("deleted");
      toast.success("Interview deleted");
    } catch {
      toast.error("Failed to delete interview");
    } finally {
      setIsDeleting(false);
    }
  }

  if (actionDone) {
    return (
      <Card className="border-dashed p-5 opacity-60">
        <p className="text-sm text-muted-foreground">
          {actionDone === "approved" ? "Approved" : actionDone === "deleted" ? "Deleted" : "Rejected"} review for{" "}
          <span className="font-medium text-foreground">
            {interview.role_title}
          </span>{" "}
          at{" "}
          <span className="font-medium text-foreground">
            {interview.companies?.name ?? "Unknown"}
          </span>
        </p>
      </Card>
    );
  }

  const outcome = interview.outcome
    ? OUTCOME_LABELS[interview.outcome]
    : null;

  const submitted = new Date(interview.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {interview.companies?.name ?? "Unknown Company"}
              </h3>
              {flagCount && flagCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {flagCount} {flagCount === 1 ? "flag" : "flags"}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {interview.role_title}
              {interview.seniority && ` · ${interview.seniority}`}
              {interview.location && ` · ${interview.location}`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {outcome && (
              <Badge className={outcome.className}>{outcome.label}</Badge>
            )}
            <span className="text-xs text-muted-foreground">{submitted}</span>
          </div>
        </div>

        {/* Ratings summary */}
        <div className="mt-3 flex flex-wrap gap-2">
          <RatingPill label="Prof" value={interview.professionalism_rating} />
          <RatingPill label="Comms" value={interview.communication_rating} />
          <RatingPill label="Clarity" value={interview.clarity_rating} />
          <RatingPill label="Fair" value={interview.fairness_rating} />
        </div>

        {/* Red flags */}
        {(interview.ghosted ||
          interview.unpaid_task ||
          interview.exceeded_timeline) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {interview.ghosted && (
              <Badge variant="outline" className="border-rose-200 text-rose-600 text-xs">
                Ghosted
              </Badge>
            )}
            {interview.unpaid_task && (
              <Badge variant="outline" className="border-amber-200 text-amber-600 text-xs">
                Unpaid task
              </Badge>
            )}
            {interview.exceeded_timeline && (
              <Badge variant="outline" className="border-orange-200 text-orange-600 text-xs">
                Exceeded timeline
              </Badge>
            )}
          </div>
        )}

        {/* Comments preview */}
        {interview.overall_comments && (() => {
          const idx = interview.overall_comments!.indexOf("---FOLLOW_UP_DATA---");
          const cleaned = idx === -1 ? interview.overall_comments : interview.overall_comments!.substring(0, idx).trim();
          return cleaned ? (
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {cleaned}
            </p>
          ) : null;
        })()}

        {interview.candidate_tip && (
          <p className="mt-2 line-clamp-2 text-sm italic text-muted-foreground">
            Tip: {interview.candidate_tip}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isApproving || isRejecting || isDeleting}
              >
                {isApproving ? "Approving..." : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={isApproving || isRejecting || isDeleting}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={isApproving || isRejecting || isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the{" "}
                    <strong>{interview.role_title}</strong> review at{" "}
                    <strong>{interview.companies?.name ?? "Unknown"}</strong>.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </Card>
  );
}

function RatingPill({ label, value }: { label: string; value: number }) {
  const colour =
    value >= 4
      ? "bg-emerald-50 text-emerald-700"
      : value >= 3
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colour}`}
    >
      {label} {value}/5
    </span>
  );
}
