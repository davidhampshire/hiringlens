"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createRepresentativeSchema,
  companyResponseSchema,
} from "@/lib/validators";
import { sendEmail, sendAdminEmail, repVerifiedEmail, adminNewResponseEmail } from "@/lib/email";

// ── Helpers ──────────────────────────────────────────

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

async function requireCompanyRep() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: representative } = await supabase
    .from("company_representatives")
    .select("*, companies(name, slug)")
    .eq("user_id", user.id)
    .not("verified_at", "is", null)
    .single();

  if (!representative) throw new Error("Not a verified company representative");

  return { supabase, userId: user.id, representative };
}

// ── Admin Actions ────────────────────────────────────

export async function createCompanyRepresentative(formData: FormData) {
  const { supabase } = await requireAdmin();

  const raw = {
    user_email: formData.get("user_email") as string,
    company_id: formData.get("company_id") as string,
    role: (formData.get("role") as string) || "responder",
  };

  const parsed = createRepresentativeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { user_email, company_id, role } = parsed.data;

  // Look up the user by email using service role key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: "Service role key not configured" };
  }

  const { createClient: createServiceClient } = await import(
    "@supabase/supabase-js"
  );
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  // Find user by email
  const { data: userList } = await admin.auth.admin.listUsers();
  const targetUser = userList?.users?.find(
    (u) => u.email?.toLowerCase() === user_email.toLowerCase()
  );

  if (!targetUser) {
    return {
      error:
        "No account found for that email. The user must create a HiringLens account first.",
    };
  }

  // Check if rep already exists
  const { data: existing } = await supabase
    .from("company_representatives")
    .select("id")
    .eq("user_id", targetUser.id)
    .eq("company_id", company_id)
    .single();

  if (existing) {
    return { error: "This user is already a representative for this company." };
  }

  // Get company name for the email
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", company_id)
    .single();

  // Insert the representative
  const { error } = await supabase.from("company_representatives").insert({
    user_id: targetUser.id,
    company_id,
    email: user_email.toLowerCase(),
    role,
    verified_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  // Send notification email to the rep
  if (company?.name) {
    const emailContent = repVerifiedEmail(company.name);
    sendEmail({ to: user_email, ...emailContent }).catch(() => {});
  }

  revalidatePath("/admin");

  return { success: true };
}

export async function revokeCompanyRepresentative(repId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("company_representatives")
    .delete()
    .eq("id", repId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

  return { success: true };
}

export async function moderateCompanyResponse(
  responseId: string,
  status: "published" | "hidden"
) {
  const { supabase } = await requireAdmin();

  // Get response with company info for revalidation
  const { data: response } = await supabase
    .from("company_responses")
    .select("interview_id, company_representatives(company_id, email, companies(slug))")
    .eq("id", responseId)
    .single();

  const { error } = await supabase
    .from("company_responses")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", responseId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

  // Revalidate the company page when publishing/hiding
  const rep = response?.company_representatives as unknown as {
    company_id: string;
    email: string;
    companies: { slug: string } | null;
  } | null;

  if (rep?.companies?.slug) {
    revalidatePath(`/company/${rep.companies.slug}`);
    revalidatePath("/recent");
  }

  return { success: true };
}

export async function deleteCompanyResponse(responseId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("company_responses")
    .delete()
    .eq("id", responseId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");

  return { success: true };
}

// ── Company Rep Actions ──────────────────────────────

export async function submitCompanyResponse(data: {
  interview_id: string;
  body: string;
}) {
  const { supabase, representative } = await requireCompanyRep();

  const parsed = companyResponseSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { interview_id, body } = parsed.data;

  // Verify the interview belongs to the rep's company
  const { data: interview } = await supabase
    .from("interviews")
    .select("id, company_id, role_title")
    .eq("id", interview_id)
    .eq("company_id", representative.company_id)
    .eq("status", "approved")
    .single();

  if (!interview) {
    return { error: "Interview not found or does not belong to your company." };
  }

  // Check for existing response
  const { data: existing } = await supabase
    .from("company_responses")
    .select("id")
    .eq("interview_id", interview_id)
    .single();

  if (existing) {
    return { error: "A response already exists for this review." };
  }

  const { error } = await supabase.from("company_responses").insert({
    interview_id,
    representative_id: representative.id,
    body,
    status: "pending",
  });

  if (error) return { error: error.message };

  // Notify admin
  const company = representative.companies as unknown as {
    name: string;
    slug: string;
  } | null;
  if (company?.name) {
    const emailContent = adminNewResponseEmail(
      company.name,
      interview.role_title
    );
    sendAdminEmail(emailContent.subject, emailContent.html).catch(() => {});
  }

  revalidatePath("/company-dashboard");
  revalidatePath("/admin");

  return { success: true };
}

export async function updateCompanyResponse(responseId: string, body: string) {
  const { supabase, representative } = await requireCompanyRep();

  if (body.length < 20 || body.length > 2000) {
    return { error: "Response must be between 20 and 2,000 characters." };
  }

  // Verify ownership and pending status
  const { data: response } = await supabase
    .from("company_responses")
    .select("id, representative_id, status")
    .eq("id", responseId)
    .single();

  if (!response) return { error: "Response not found." };
  if (response.representative_id !== representative.id) {
    return { error: "You can only edit your own responses." };
  }
  if (response.status !== "pending") {
    return { error: "Only pending responses can be edited." };
  }

  const { error } = await supabase
    .from("company_responses")
    .update({ body, updated_at: new Date().toISOString() })
    .eq("id", responseId);

  if (error) return { error: error.message };

  revalidatePath("/company-dashboard");

  return { success: true };
}

export async function getCompanyDashboardData() {
  const { supabase, representative } = await requireCompanyRep();

  // Fetch company info
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", representative.company_id)
    .single();

  // Fetch approved interviews for this company
  const { data: interviews } = await supabase
    .from("interviews")
    .select("*")
    .eq("company_id", representative.company_id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Fetch all responses by this rep
  const { data: responses } = await supabase
    .from("company_responses")
    .select("*")
    .eq("representative_id", representative.id);

  // Build a lookup map: interview_id → response
  const responseMap = new Map<string, (typeof responses extends (infer T)[] | null ? T : never)>();
  for (const r of responses ?? []) {
    responseMap.set(r.interview_id, r);
  }

  return {
    company,
    representative,
    interviews: interviews ?? [],
    responseMap: Object.fromEntries(responseMap),
  };
}
