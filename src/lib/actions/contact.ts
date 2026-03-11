"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators";
import { headers } from "next/headers";

const MAX_CONTACT_PER_HOUR = 3;

const SUBJECT_LABELS: Record<string, string> = {
  general: "General enquiry",
  feedback: "Feedback or suggestion",
  report: "Report an issue",
  company_rep: "[Company Rep]",
  other: "Other",
};

export async function submitContactMessage(_prev: unknown, formData: FormData) {
  const subjectKey = (formData.get("subject") as string) ?? "";
  const companyName = (formData.get("company_name") as string)?.trim() ?? "";

  // Build a human-readable subject line
  let subjectLine = SUBJECT_LABELS[subjectKey] ?? subjectKey;
  if (subjectKey === "company_rep" && companyName) {
    subjectLine = `[Company Rep] ${companyName}`;
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: subjectLine,
    message: formData.get("message") as string,
  };

  const parsed = contactSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  // Rate limit: max 3 contact messages per email per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", parsed.data.email)
    .gte("created_at", oneHourAgo);

  if (count !== null && count >= MAX_CONTACT_PER_HOUR) {
    return {
      error: "You've sent too many messages recently. Please try again in an hour.",
    };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    return { error: "Something went wrong. Please try again later." };
  }

  return { success: true };
}
