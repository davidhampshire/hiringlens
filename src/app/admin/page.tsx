import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminTabs } from "@/components/admin/admin-tabs";
import type { Interview } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string } | null;
};

type InterviewWithFlags = InterviewWithCompany & {
  flag_count: number;
};

export default async function AdminPage() {
  const supabase = await createClient();

  // Verify the user is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  // Fetch pending interviews
  const { data: pendingData } = await supabase
    .from("interviews")
    .select("*, companies(name, slug)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const pendingInterviews = (pendingData ?? []) as unknown as InterviewWithCompany[];

  // Fetch flagged interviews (approved but have moderation flags)
  // First get interview IDs that have flags
  const { data: flagData } = await supabase
    .from("moderation_flags")
    .select("interview_id");

  const flaggedIds = [...new Set((flagData ?? []).map((f) => f.interview_id))];

  let flaggedInterviews: InterviewWithFlags[] = [];

  if (flaggedIds.length > 0) {
    const { data: flaggedData } = await supabase
      .from("interviews")
      .select("*, companies(name, slug)")
      .in("id", flaggedIds)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    // Count flags per interview
    const flagCounts = new Map<string, number>();
    for (const flag of flagData ?? []) {
      flagCounts.set(flag.interview_id, (flagCounts.get(flag.interview_id) ?? 0) + 1);
    }

    flaggedInterviews = ((flaggedData ?? []) as unknown as InterviewWithCompany[]).map(
      (interview) => ({
        ...interview,
        flag_count: flagCounts.get(interview.id) ?? 0,
      })
    );
  }

  // Get counts
  const { count: totalPending } = await supabase
    .from("interviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: totalApproved } = await supabase
    .from("interviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-in-view mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage submitted interview experiences and flagged content.
        </p>
        <div className="mt-4 flex gap-4">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-bold text-amber-600">{totalPending ?? 0}</p>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-bold text-emerald-600">{totalApproved ?? 0}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-2xl font-bold text-rose-600">{flaggedInterviews.length}</p>
            <p className="text-xs text-muted-foreground">Flagged</p>
          </div>
        </div>
      </div>

      <div className="animate-in-view-d1">
        <AdminTabs
          pendingInterviews={pendingInterviews}
          flaggedInterviews={flaggedInterviews}
        />
      </div>
    </div>
  );
}
