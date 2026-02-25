"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators";
import { headers } from "next/headers";

const MAX_CONTACT_PER_HOUR = 3;

export async function submitContactMessage(_prev: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
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
