import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("interviews")
    .select(
      "id, role_title, overall_comments, candidate_tip, created_at, company_id, companies(name, slug)"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (data ?? []) as unknown as Array<{
    id: string;
    role_title: string;
    overall_comments: string | null;
    candidate_tip: string | null;
    created_at: string;
    company_id: string;
    companies: { name: string; slug: string } | null;
  }>;

  const rssItems = items
    .map((item) => {
      const companyName = item.companies?.name ?? "Unknown Company";
      const slug = item.companies?.slug ?? "";
      const link = `${SITE_URL}/company/${slug}`;
      const title = `${item.role_title} Interview at ${companyName}`;
      const description =
        item.candidate_tip || item.overall_comments || `Interview experience for ${item.role_title} at ${companyName}`;
      const pubDate = new Date(item.created_at).toUTCString();

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description.slice(0, 500))}</description>
      <category>${escapeXml(companyName)}</category>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HiringLens - Latest Interview Experiences</title>
    <link>${SITE_URL}</link>
    <description>Real interview experiences from real candidates. Know the process, prepare smarter, and interview with confidence.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
