"use server";

import { createClient } from "@/lib/supabase/server";

export async function exportUserData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch all user interviews with company names
  const { data: interviews } = await supabase
    .from("interviews")
    .select("*, companies(name, slug, industry)")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false });

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const exportData = {
    exported_at: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile: profile
      ? {
          display_name: profile.display_name ?? null,
          is_admin: profile.is_admin ?? false,
          created_at: profile.created_at,
        }
      : null,
    interviews: (interviews ?? []).map((i) => ({
      id: i.id,
      company: i.companies?.name ?? "Unknown",
      company_industry: i.companies?.industry ?? null,
      role_title: i.role_title,
      seniority: i.seniority,
      location: i.location,
      interview_type: i.interview_type,
      stages_count: i.stages_count,
      total_duration_days: i.total_duration_days,
      outcome: i.outcome,
      received_feedback: i.received_feedback,
      unpaid_task: i.unpaid_task,
      ghosted: i.ghosted,
      interviewer_late: i.interviewer_late,
      exceeded_timeline: i.exceeded_timeline,
      professionalism_rating: i.professionalism_rating,
      communication_rating: i.communication_rating,
      clarity_rating: i.clarity_rating,
      fairness_rating: i.fairness_rating,
      salary_range: i.salary_range,
      display_name: i.display_name,
      application_source: i.application_source,
      recommend_applying: i.recommend_applying,
      interview_questions: i.interview_questions,
      interview_date: i.interview_date,
      department: i.department,
      jd_accuracy: i.jd_accuracy,
      overall_comments: i.overall_comments,
      candidate_tip: i.candidate_tip,
      status: i.status,
      created_at: i.created_at,
    })),
    total_submissions: interviews?.length ?? 0,
  };

  return { data: JSON.stringify(exportData, null, 2) };
}
