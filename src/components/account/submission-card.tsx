"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { OUTCOME_LABELS, SENIORITY_LABELS } from "@/lib/constants";
import { deleteInterview } from "@/lib/actions/interview";

const STATUS_STYLES: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending Review", variant: "secondary" },
  approved: { label: "Published", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

interface SubmissionCardProps {
  interview: {
    id: string;
    role_title: string;
    seniority: string | null;
    outcome: string | null;
    status: string;
    created_at: string;
    companies: { name: string; slug: string } | null;
  };
}

export function SubmissionCard({ interview }: SubmissionCardProps) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);

  const status = STATUS_STYLES[interview.status] ?? STATUS_STYLES.pending;
  const date = new Date(interview.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteInterview(interview.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Submission deleted");
        setDeleted(true);
      }
    });
  }

  if (deleted) return null;

  return (
    <Card className="gap-0 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {interview.companies && (
            <Link
              href={`/company/${interview.companies.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {interview.companies.name}
            </Link>
          )}
          <p className="font-semibold">{interview.role_title}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {interview.seniority && (
              <span>{SENIORITY_LABELS[interview.seniority]}</span>
            )}
            {interview.outcome && (
              <span>{OUTCOME_LABELS[interview.outcome]}</span>
            )}
            <span>{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="shrink-0 text-xs">
            {status.label}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            asChild
          >
            <Link href={`/submit/edit/${interview.id}`}>Edit</Link>
          </Button>
          {interview.status === "pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={isPending}
                >
                  {isPending ? "..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete submission?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your pending submission for{" "}
                    <strong>{interview.role_title}</strong>
                    {interview.companies
                      ? ` at ${interview.companies.name}`
                      : ""}
                    . This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </Card>
  );
}
