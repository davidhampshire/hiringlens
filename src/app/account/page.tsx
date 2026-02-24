import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OUTCOME_LABELS, SENIORITY_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Account | HiringLens",
  description: "View your submitted interview experiences.",
  robots: { index: false },
};

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending Review", variant: "secondary" },
  approved: { label: "Published", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's interviews with company names (all statuses via RLS)
  const { data: interviews } = await supabase
    .from("interviews")
    .select("*, companies(name, slug)")
    .eq("submitted_by", user!.id)
    .order("created_at", { ascending: false });

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Account Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="mt-1 text-muted-foreground">{user!.email}</p>
        {memberSince && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Member since {memberSince}
          </p>
        )}
      </div>

      {/* Submissions Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          My Submissions
          {interviews && interviews.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({interviews.length})
            </span>
          )}
        </h2>
        <Button size="sm" asChild>
          <Link href="/submit">Share Experience</Link>
        </Button>
      </div>

      {interviews && interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview) => {
            const status = STATUS_STYLES[interview.status] ?? STATUS_STYLES.pending;
            const date = new Date(interview.created_at).toLocaleDateString(
              "en-GB",
              { day: "numeric", month: "short", year: "numeric" }
            );
            const company = interview.companies as { name: string; slug: string } | null;

            return (
              <Card key={interview.id} className="gap-0 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {company && (
                      <Link
                        href={`/company/${company.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {company.name}
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
                  <Badge variant={status.variant} className="shrink-0 text-xs">
                    {status.label}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-7 w-7 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="font-semibold">No submissions yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your interview experiences to help other candidates make
            informed decisions.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/submit">Share Your First Experience</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
