"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  // Get the company slug for revalidation
  const { data: interview } = await supabase
    .from("interviews")
    .select("company_id")
    .eq("id", interviewId)
    .single();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "approved" })
    .eq("id", interviewId);

  if (error) throw new Error(error.message);

  // Revalidate the company page and homepage
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

export async function rejectInterview(interviewId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("interviews")
    .update({ status: "rejected" })
    .eq("id", interviewId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

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
