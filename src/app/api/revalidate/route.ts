import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/** Constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: NextRequest) {
  try {
    const revalidationSecret = process.env.REVALIDATION_SECRET;
    if (!revalidationSecret) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const { slug, secret } = await request.json();

    if (!secret || typeof secret !== "string" || !safeCompare(secret, revalidationSecret)) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (slug && typeof slug === "string" && /^[a-z0-9-]+$/.test(slug)) {
      revalidatePath(`/company/${slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
