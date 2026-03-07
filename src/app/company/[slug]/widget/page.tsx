import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { WidgetCodeBlock } from "@/components/company/widget-code-block";
import type { CompanyScore } from "@/types";

interface WidgetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WidgetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_scores")
    .select("name")
    .eq("slug", slug)
    .single();

  return {
    title: data ? `Embed ${data.name} Widget` : "Widget Not Found",
  };
}

export default async function WidgetPage({ params }: WidgetPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("company_scores")
    .select("name, slug")
    .eq("slug", slug)
    .single();

  if (!company) notFound();

  const c = company as CompanyScore;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";
  const widgetUrl = `${siteUrl}/api/widget/${c.slug}`;
  const embedCode = `<iframe src="${widgetUrl}" width="280" height="60" frameborder="0" style="border:none;overflow:hidden;" loading="lazy"></iframe>`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Companies", href: "/companies" },
          { label: c.name, href: `/company/${c.slug}` },
          { label: "Widget" },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-bold">Embed {c.name} Widget</h1>
        <p className="mt-2 text-muted-foreground">
          Show your company&apos;s HiringLens score on your website, career page, or job postings.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold">Preview</h2>
          <div className="mt-3 rounded-lg border bg-muted/30 p-6">
            <iframe
              src={widgetUrl}
              width={280}
              height={60}
              style={{ border: "none", overflow: "hidden" }}
              title={`${c.name} HiringLens widget preview`}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Embed Code</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy and paste this HTML into your website.
          </p>
          <WidgetCodeBlock code={embedCode} />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/company/${c.slug}`}>Back to {c.name}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
