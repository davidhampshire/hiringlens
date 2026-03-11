import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompanyDashboard } from "@/components/company-dashboard/company-dashboard";

export const metadata: Metadata = {
  title: "Company Dashboard | HiringLens",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function CompanyDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?redirectTo=/company-dashboard");

  // Check if user is a verified company representative
  const { data: representative } = await supabase
    .from("company_representatives")
    .select("*, companies(id, name, slug, industry, logo_url)")
    .eq("user_id", user.id)
    .not("verified_at", "is", null)
    .single();

  if (!representative) redirect("/");

  const company = representative.companies as unknown as {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    logo_url: string | null;
  } | null;

  if (!company) redirect("/");

  // Fetch approved interviews for this company
  const { data: interviews } = await supabase
    .from("interviews")
    .select("*")
    .eq("company_id", representative.company_id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Fetch all responses by this representative
  const { data: responses } = await supabase
    .from("company_responses")
    .select("*")
    .eq("representative_id", representative.id);

  // Build response map: interview_id → response
  const responseMap: Record<string, NonNullable<typeof responses>[number]> = {};
  for (const r of responses ?? []) {
    responseMap[r.interview_id] = r;
  }

  const stats = {
    totalReviews: interviews?.length ?? 0,
    totalResponses: responses?.length ?? 0,
    pendingResponses: responses?.filter((r) => r.status === "pending").length ?? 0,
    publishedResponses: responses?.filter((r) => r.status === "published").length ?? 0,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <CompanyDashboard
        company={company}
        representative={representative}
        interviews={interviews ?? []}
        responseMap={responseMap}
        stats={stats}
      />
    </div>
  );
}
