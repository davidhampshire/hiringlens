import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CompanyScore } from "@/types";

export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("company_scores")
    .select("name, slug, reality_score, total_reviews")
    .eq("slug", slug)
    .single();

  if (!data) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const c = data as CompanyScore;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";
  const score = c.reality_score != null ? Math.round(c.reality_score) : null;

  const scoreColor =
    score === null
      ? "#888"
      : score >= 80
        ? "#16a34a"
        : score >= 60
          ? "#65a30d"
          : score >= 40
            ? "#d97706"
            : score >= 20
              ? "#ea580c"
              : "#dc2626";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: transparent; }
  a { text-decoration: none; color: inherit; }
  .widget {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    background: #fff;
    transition: border-color 0.2s;
  }
  .widget:hover { border-color: #999; }
  .score {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    background: ${scoreColor};
  }
  .info { line-height: 1.3; }
  .name { font-size: 13px; font-weight: 600; color: #111; }
  .meta { font-size: 11px; color: #888; }
  .brand { font-size: 10px; color: #bbb; margin-top: 1px; }
</style>
</head>
<body>
  <a href="${siteUrl}/company/${slug}" target="_blank" rel="noopener noreferrer" class="widget">
    <div class="score">${score ?? "-"}</div>
    <div class="info">
      <div class="name">${escapeHtml(c.name)}</div>
      <div class="meta">${c.total_reviews} review${c.total_reviews === 1 ? "" : "s"} on HiringLens</div>
    </div>
  </a>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Frame-Options": "ALLOWALL",
    },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
