import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmissionCard } from "@/components/account/submission-card";

export const metadata: Metadata = {
  title: "My Account | HiringLens",
  description: "View your submitted interview experiences.",
  robots: { index: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's interviews with company names (all statuses via RLS)
  const { data: interviews } = await supabase
    .from("interviews")
    .select("id, role_title, seniority, outcome, status, created_at, companies(name, slug)")
    .eq("submitted_by", user!.id)
    .order("created_at", { ascending: false });

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  // Compute stats
  const total = interviews?.length ?? 0;
  const approved = interviews?.filter((i) => i.status === "approved").length ?? 0;
  const pending = interviews?.filter((i) => i.status === "pending").length ?? 0;
  const rejected = interviews?.filter((i) => i.status === "rejected").length ?? 0;

  const stats = [
    { label: "Total", value: total, color: "text-foreground" },
    { label: "Published", value: approved, color: "text-emerald-600" },
    { label: "Pending", value: pending, color: "text-amber-600" },
    { label: "Rejected", value: rejected, color: "text-destructive" },
  ];

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

      {/* Stats Bar */}
      {total > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="gap-0 p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Submissions Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          My Submissions
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({total})
            </span>
          )}
        </h2>
        <Button size="sm" asChild>
          <Link href="/submit">Share Experience</Link>
        </Button>
      </div>

      {interviews && interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <SubmissionCard
              key={interview.id}
              interview={{
                ...interview,
                companies: interview.companies as unknown as { name: string; slug: string } | null,
              }}
            />
          ))}
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
