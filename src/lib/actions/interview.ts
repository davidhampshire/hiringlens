"use server";

import { createClient } from "@/lib/supabase/server";
import { interviewSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const MAX_SUBMISSIONS_PER_DAY = 3;

interface SubmitPayload {
  formData: Record<string, unknown>;
  followUpData: Record<string, Record<string, string>>;
}

export async function submitInterview(payload: SubmitPayload) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to submit an experience." };
  }

  // Validate form data
  const parsed = interviewSchema.safeParse(payload.formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Rate limit: max 3 per 24h
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { count } = await supabase
    .from("interviews")
    .select("id", { count: "exact", head: true })
    .eq("submitted_by", user.id)
    .gte("created_at", twentyFourHoursAgo);

  if (count !== null && count >= MAX_SUBMISSIONS_PER_DAY) {
    return {
      error: `You can submit up to ${MAX_SUBMISSIONS_PER_DAY} experiences per day. Please try again later.`,
    };
  }

  // Handle company creation / lookup
  let companyId = data.company_id;

  if (!companyId) {
    const slug = slugify(data.company_name);
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: data.company_name.trim(),
          slug,
          industry: data.industry ?? null,
        })
        .select("id")
        .single();

      if (companyError) {
        return { error: "Failed to create company. Please try again." };
      }
      companyId = newCompany.id;
    }
  }

  // Build follow-up comments payload
  let commentsPayload = data.overall_comments || "";
  if (Object.keys(payload.followUpData).length > 0) {
    const followUpJson = JSON.stringify(payload.followUpData);
    commentsPayload = commentsPayload
      ? `${commentsPayload}\n\n---FOLLOW_UP_DATA---\n${followUpJson}`
      : `---FOLLOW_UP_DATA---\n${followUpJson}`;
  }

  // Insert interview
  const { error: interviewError } = await supabase.from("interviews").insert({
    company_id: companyId,
    role_title: data.role_title,
    seniority: data.seniority ?? null,
    location: data.location || null,
    interview_type: data.interview_type ?? null,
    stages_count: data.stages_count ?? null,
    total_duration_days: data.total_duration_days ?? null,
    outcome: data.outcome ?? null,
    received_feedback: data.received_feedback,
    unpaid_task: data.unpaid_task,
    ghosted: data.ghosted,
    interviewer_late: data.interviewer_late,
    exceeded_timeline: data.exceeded_timeline,
    professionalism_rating: data.professionalism_rating,
    communication_rating: data.communication_rating,
    clarity_rating: data.clarity_rating,
    fairness_rating: data.fairness_rating,
    salary_range: data.salary_range || null,
    display_name: data.display_name?.trim() || null,
    application_source: data.application_source ?? null,
    recommend_applying: data.recommend_applying ?? null,
    interview_questions: data.interview_questions || null,
    interview_date: data.interview_date || null,
    department: data.department?.trim() || null,
    jd_accuracy: data.jd_accuracy ?? null,
    overall_comments: commentsPayload || null,
    candidate_tip: data.candidate_tip || null,
    submitted_by: user.id,
    status: "pending",
  });

  if (interviewError) {
    return { error: "Failed to submit experience. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/recent");
  revalidatePath("/admin");

  return { success: true };
}

export async function getInterviewForEdit(interviewId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: interview } = await supabase
    .from("interviews")
    .select("*, companies(name, slug)")
    .eq("id", interviewId)
    .single();

  if (!interview || interview.submitted_by !== user.id) {
    return { error: "Not authorised" };
  }

  return { data: interview };
}

export async function updateInterview(
  interviewId: string,
  payload: SubmitPayload
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to edit an experience." };
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("interviews")
    .select("id, submitted_by, company_id")
    .eq("id", interviewId)
    .single();

  if (!existing || existing.submitted_by !== user.id) {
    return { error: "Not authorised" };
  }

  // Validate form data
  const parsed = interviewSchema.safeParse(payload.formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Handle company creation / lookup
  let companyId = data.company_id;

  if (!companyId) {
    const slug = slugify(data.company_name);
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: data.company_name.trim(),
          slug,
          industry: data.industry ?? null,
        })
        .select("id")
        .single();

      if (companyError) {
        return { error: "Failed to create company. Please try again." };
      }
      companyId = newCompany.id;
    }
  }

  // Build follow-up comments payload
  let commentsPayload = data.overall_comments || "";
  if (Object.keys(payload.followUpData).length > 0) {
    const followUpJson = JSON.stringify(payload.followUpData);
    commentsPayload = commentsPayload
      ? `${commentsPayload}\n\n---FOLLOW_UP_DATA---\n${followUpJson}`
      : `---FOLLOW_UP_DATA---\n${followUpJson}`;
  }

  // Update interview — edited posts go back to pending for re-review
  const { error: updateError } = await supabase
    .from("interviews")
    .update({
      company_id: companyId,
      role_title: data.role_title,
      seniority: data.seniority ?? null,
      location: data.location || null,
      interview_type: data.interview_type ?? null,
      stages_count: data.stages_count ?? null,
      total_duration_days: data.total_duration_days ?? null,
      outcome: data.outcome ?? null,
      received_feedback: data.received_feedback,
      unpaid_task: data.unpaid_task,
      ghosted: data.ghosted,
      interviewer_late: data.interviewer_late,
      exceeded_timeline: data.exceeded_timeline,
      professionalism_rating: data.professionalism_rating,
      communication_rating: data.communication_rating,
      clarity_rating: data.clarity_rating,
      fairness_rating: data.fairness_rating,
      salary_range: data.salary_range || null,
      display_name: data.display_name?.trim() || null,
      application_source: data.application_source ?? null,
      recommend_applying: data.recommend_applying ?? null,
      interview_questions: data.interview_questions || null,
      interview_date: data.interview_date || null,
      department: data.department?.trim() || null,
      jd_accuracy: data.jd_accuracy ?? null,
      overall_comments: commentsPayload || null,
      candidate_tip: data.candidate_tip || null,
      status: "pending",
    })
    .eq("id", interviewId);

  if (updateError) {
    return { error: "Failed to update experience. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/recent");
  revalidatePath("/admin");
  revalidatePath("/account");

  // Revalidate company page
  if (companyId) {
    const { data: company } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", companyId)
      .single();

    if (company?.slug) {
      revalidatePath(`/company/${company.slug}`);
    }
  }

  return { success: true };
}

export async function deleteInterview(interviewId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify ownership and pending status
  const { data: interview } = await supabase
    .from("interviews")
    .select("id, submitted_by, status")
    .eq("id", interviewId)
    .single();

  if (!interview || interview.submitted_by !== user.id) {
    return { error: "Not authorised" };
  }

  if (interview.status !== "pending") {
    return { error: "Only pending submissions can be deleted" };
  }

  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}

export async function getIndustryAverageDuration(industry: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("company_scores")
    .select("avg_duration_days")
    .eq("industry", industry)
    .not("avg_duration_days", "is", null);

  if (!data || data.length === 0) return null;

  const total = data.reduce(
    (sum, row) => sum + (row.avg_duration_days ?? 0),
    0
  );
  return Math.round(total / data.length);
}
