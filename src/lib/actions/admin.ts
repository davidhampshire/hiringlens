"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  sendEmail,
  submissionApprovedEmail,
  submissionRejectedEmail,
} from "@/lib/email";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Not authorised");

  return { supabase, userId: user.id };
}

export async function approveInterview(interviewId: string) {
  const { supabase } = await requireAdmin();

  // Get the interview with company info and submitter
  const { data: interview } = await supabase
    .from("interviews")
    .select("company_id, submitted_by, companies(name, slug)")
    .eq("id", interviewId)
    .single();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "approved" })
    .eq("id", interviewId);

  if (error) throw new Error(error.message);

  // Revalidate the company page and homepage
  const company = interview?.companies as unknown as { name: string; slug: string } | null;
  if (company?.slug) {
    revalidatePath(`/company/${company.slug}`);
  }

  revalidatePath("/");
  revalidatePath("/recent");
  revalidatePath("/admin");

  // Send approval email to submitter (non-blocking, requires service role key)
  if (interview?.submitted_by && company) {
    notifySubmitter(interview.submitted_by, submissionApprovedEmail(company.name, company.slug));
  }

  return { success: true };
}

export async function rejectInterview(interviewId: string) {
  const { supabase } = await requireAdmin();

  // Get interview with company name and submitter
  const { data: interview } = await supabase
    .from("interviews")
    .select("submitted_by, companies(name)")
    .eq("id", interviewId)
    .single();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "rejected" })
    .eq("id", interviewId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

  // Send rejection email to submitter (non-blocking, requires service role key)
  const company = interview?.companies as unknown as { name: string } | null;
  if (interview?.submitted_by && company) {
    notifySubmitter(interview.submitted_by, submissionRejectedEmail(company.name));
  }

  return { success: true };
}

export async function bulkApproveInterviews(ids: string[]) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "approved" })
    .in("id", ids);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/recent");
  revalidatePath("/admin");

  return { success: true, count: ids.length };
}

export async function bulkRejectInterviews(ids: string[]) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "rejected" })
    .in("id", ids);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

  return { success: true, count: ids.length };
}

/**
 * Look up a user's email via the Supabase Admin API (requires service role key)
 * and send them an email. Fails silently if the key isn't configured.
 */
async function notifySubmitter(
  userId: string,
  email: { subject: string; html: string }
) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return;

  try {
    const { createClient: createServiceClient } = await import("@supabase/supabase-js");
    const admin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );
    const { data } = await admin.auth.admin.getUserById(userId);
    if (data?.user?.email) {
      sendEmail({ to: data.user.email, ...email }).catch(() => {});
    }
  } catch {
    // silently skip if service role lookup fails
  }
}

export async function getPasswordGateEnabled(): Promise<boolean> {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "password_gate_enabled")
    .single();

  // Default to true if no setting exists
  return data?.value === true;
}

export async function togglePasswordGate(enabled: boolean) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("site_settings")
    .update({ value: enabled, updated_at: new Date().toISOString() })
    .eq("key", "password_gate_enabled");

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

  return { success: true, enabled };
}

export type AnnouncementConfig = {
  messages: string[];
  intervalSeconds: number;
};

export async function updateAnnouncements(config: AnnouncementConfig) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("site_settings")
    .update({ value: config as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
    .eq("key", "announcements");

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function deleteInterviewAdmin(interviewId: string) {
  const { supabase } = await requireAdmin();

  // Get company info for revalidation
  const { data: interview } = await supabase
    .from("interviews")
    .select("company_id")
    .eq("id", interviewId)
    .single();

  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId);

  if (error) throw new Error(error.message);

  // Revalidate relevant pages
  if (interview?.company_id) {
    const { data: company } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", interview.company_id)
      .single();

    if (company?.slug) {
      revalidatePath(`/company/${company.slug}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/recent");
  revalidatePath("/admin");

  return { success: true };
}
