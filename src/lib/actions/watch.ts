"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToCompany(
  email: string,
  companyId: string
): Promise<{ success: boolean; alreadySubscribed?: boolean; error?: string }> {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("company_watchers").insert({
    email: email.toLowerCase().trim(),
    company_id: companyId,
  });

  if (error) {
    // Unique constraint violation = already subscribed
    if (error.code === "23505") {
      return { success: true, alreadySubscribed: true };
    }
    console.error("[Watch] Subscribe error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function unsubscribeByToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!token || token.length < 10) {
    return { success: false, error: "Invalid unsubscribe link." };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { success: false, error: "Server configuration error." };
  }

  try {
    const { createClient: createServiceClient } = await import("@supabase/supabase-js");
    const admin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const { error } = await admin
      .from("company_watchers")
      .delete()
      .eq("unsubscribe_token", token);

    if (error) {
      console.error("[Watch] Unsubscribe error:", error);
      return { success: false, error: "Could not process your request." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}
