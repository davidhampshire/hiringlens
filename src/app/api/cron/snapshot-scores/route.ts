import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Daily cron job — snapshots all company Reality Scores so we can show trends.
 * Invoked by Vercel Cron at 02:00 UTC every day.
 * Protected by CRON_SECRET (set in Vercel env vars).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "Missing service role key" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  const { data: scores, error: fetchError } = await supabase
    .from("company_scores")
    .select("company_id, reality_score, total_reviews")
    .gt("total_reviews", 0);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!scores || scores.length === 0) {
    return NextResponse.json({ success: true, count: 0, message: "No companies to snapshot" });
  }

  const { error: insertError } = await supabase.from("company_score_history").insert(
    scores.map((s) => ({
      company_id: s.company_id,
      reality_score: s.reality_score,
      total_reviews: s.total_reviews,
    }))
  );

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: scores.length });
}
