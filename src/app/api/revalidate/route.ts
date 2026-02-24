import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { slug, secret } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (slug) {
      revalidatePath(`/company/${slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
