"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators";

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
