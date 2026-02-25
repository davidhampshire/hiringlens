import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExperienceForm } from "@/components/submit/experience-form";

export const metadata: Metadata = {
  title: "Edit Your Experience | HiringLens",
  robots: { index: false },
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?redirectTo=/account");

  const { data: interview } = await supabase
    .from("interviews")
    .select("*, companies(name, slug)")
    .eq("id", id)
    .single();

  if (!interview || interview.submitted_by !== user.id) {
    notFound();
  }

  const company = interview.companies as { name: string; slug: string } | null;

  const editData = {
    id: interview.id,
    company_name: company?.name ?? "",
    company_id: interview.company_id,
    industry: undefined as string | undefined,
    role_title: interview.role_title,
    seniority: interview.seniority ?? undefined,
    location: interview.location ?? undefined,
    interview_type: interview.interview_type ?? undefined,
    salary_range: interview.salary_range ?? undefined,
    display_name: interview.display_name,
    stages_count: interview.stages_count,
    total_duration_days: interview.total_duration_days,
    outcome: interview.outcome ?? undefined,
    received_feedback: interview.received_feedback,
    unpaid_task: interview.unpaid_task,
    ghosted: interview.ghosted,
    interviewer_late: interview.interviewer_late,
    exceeded_timeline: interview.exceeded_timeline,
    professionalism_rating: interview.professionalism_rating,
    communication_rating: interview.communication_rating,
    clarity_rating: interview.clarity_rating,
    fairness_rating: interview.fairness_rating,
    overall_comments: interview.overall_comments,
    candidate_tip: interview.candidate_tip,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="animate-in-view mb-8">
        <h1 className="text-2xl font-bold">Edit Your Experience</h1>
        <p className="mt-2 text-muted-foreground">
          Update your interview experience. Edited submissions will be
          re-reviewed before publishing.
        </p>
      </div>

      <div className="animate-in-view-d1">
        <ExperienceForm editData={editData} />
      </div>
    </div>
  );
}
