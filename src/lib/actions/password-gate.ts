"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyPassword(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    // Gate disabled — shouldn't reach here, but just redirect home
    redirect("/");
  }

  if (!password || password !== sitePassword) {
    return { error: "Incorrect password. Please try again." };
  }

  // Set a cookie so the user doesn't have to re-enter the password
  const cookieStore = await cookies();
  cookieStore.set("site_access", "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  redirect("/");
}
