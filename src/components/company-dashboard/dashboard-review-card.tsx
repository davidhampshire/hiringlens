"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponseForm } from "@/components/company-dashboard/response-form";
import type { Interview, CompanyResponse } from "@/types";

const RATING_COLORS: Record<string, string> = {
  high: "bg-emerald-100 text-emerald-700",
  mid: "bg-amber-100 text-amber-700",
  low: "bg-rose-100 text-rose-700",
};

function ratingColor(avg: number) {
  if (avg >= 4) return RATING_COLORS.high;
  if (avg >= 3) return RATING_COLORS.mid;
  return RATING_COLORS.low;
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  pending: { bg: "bg-amber-100 text-amber-700", label: "Pending Review" },
  published: { bg: "bg-emerald-100 text-emerald-700", label: "Published" },
  hidden: { bg: "bg-rose-100 text-rose-700", label: "Hidden" },
};

interface DashboardReviewCardProps {
  interview: Interview;
  response: CompanyResponse | null;
  representativeId: string;
}

export function DashboardReviewCard({
  interview,
  response,
  representativeId,
}: DashboardReviewCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const avgRating =
    (interview.professionalism_rating +
      interview.communication_rating +
      interview.clarity_rating +
      interview.fairness_rating) /
    4;

  // Strip follow-up data from comments
  const comments = interview.overall_comments?.split("---FOLLOW_UP_DATA---")[0]?.trim() ?? "";

  const statusStyle = response ? STATUS_STYLES[response.status] : null;

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
        {/* Review header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{interview.role_title}</h3>
              <Badge className={ratingColor(avgRating)}>
                {avgRating.toFixed(1)}
              </Badge>
              {interview.outcome && (
                <Badge variant="outline" className="text-xs capitalize">
                  {interview.outcome.replace("_", " ")}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {interview.seniority && (
                <span className="capitalize">{interview.seniority.replace("_", " ")} &middot; </span>
              )}
              {new Date(interview.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Review comments */}
        {comments && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {comments}
          </p>
        )}

        {/* Candidate tip */}
        {interview.candidate_tip && (
          <div className="mt-2 rounded-md bg-muted/50 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">Candidate tip:</p>
            <p className="line-clamp-2 text-sm italic text-muted-foreground">
              &ldquo;{interview.candidate_tip}&rdquo;
            </p>
          </div>
        )}

        {/* Response section */}
        <div className="mt-4 border-t pt-4">
          {!response && !showForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowForm(true)}
            >
              Respond to this review
            </Button>
          )}

          {!response && showForm && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Your Response</h4>
              <ResponseForm
                interviewId={interview.id}
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {response && !isEditing && (
            <div
              className={`rounded-md border px-4 py-3 ${
                response.status === "published"
                  ? "border-emerald-200 bg-emerald-50/50"
                  : response.status === "hidden"
                    ? "border-rose-200 bg-rose-50/50"
                    : "border-amber-200 bg-amber-50/50"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium">Your response</span>
                {statusStyle && (
                  <Badge className={statusStyle.bg}>{statusStyle.label}</Badge>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {response.body}
              </p>
              {response.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          )}

          {response && isEditing && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Edit Your Response</h4>
              <ResponseForm
                interviewId={interview.id}
                existingResponseId={response.id}
                initialBody={response.body}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
