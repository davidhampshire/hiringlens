import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmissionCard } from "@/components/account/submission-card";
import { ConnectedAccounts } from "@/components/account/connected-accounts";
import type { UserIdentity } from "@supabase/supabase-js";

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

  // Check linked identities for connected accounts section
  const linkedInIdentity =
    (user?.identities?.find((id: UserIdentity) => id.provider === "linkedin_oidc") as UserIdentity) ?? null;

  // Check if user is a verified company representative
  const { data: repRecord } = await supabase
    .from("company_representatives")
    .select("id, role, verified_at, companies(name, slug)")
    .eq("user_id", user!.id)
    .not("verified_at", "is", null)
    .limit(1)
    .maybeSingle();

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
      <div className="animate-in-view mb-8">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="mt-1 text-muted-foreground">{user!.email}</p>
        {memberSince && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Member since {memberSince}
          </p>
        )}
      </div>

      {/* Company Rep Card */}
      {repRecord && (
        <div className="animate-in-view-d1 mb-6">
          <Card className="border-blue-200 bg-blue-50/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Rep
                  </span>
                  <span className="text-sm font-medium text-blue-800">
                    {(repRecord.companies as unknown as { name: string; slug: string })?.name}
                  </span>
                </div>
                <p className="mt-1 text-xs text-blue-600/80">
                  Respond to candidate reviews about your company
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href="/company-dashboard">Company Dashboard</Link>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Bar */}
      {total > 0 && (
        <div className="animate-in-view-d1 mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="gap-0 p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Connected Accounts */}
      <div className="animate-in-view-d2 mb-6">
        <ConnectedAccounts linkedInIdentity={linkedInIdentity} />
      </div>

      {/* Submissions Section */}
      <div className="animate-in-view-d2 mb-4 flex items-center justify-between">
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
        <div className="animate-in-view-d3 space-y-3">
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
