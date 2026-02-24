import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CompanyCard } from "@/components/shared/company-card";
import { EmptyState } from "@/components/shared/empty-state";
import { INDUSTRIES } from "@/lib/constants";
import type { CompanyScore } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; industry?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search Companies",
    description: q
      ? `Interview experiences for "${q}" on HiringLens.`
      : "Search companies and explore real interview experiences from candidates.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, industry } = await searchParams;
  const supabase = await createClient();

  let companies: CompanyScore[] = [];

  if (q) {
    const { data } = await supabase.rpc("search_companies", {
      search_query: q,
      result_limit: 20,
    });
    companies = (data ?? []) as CompanyScore[];
  } else if (industry) {
    const { data } = await supabase
      .from("company_scores")
      .select("*")
      .eq("industry", industry)
      .order("total_reviews", { ascending: false })
      .limit(20);
    companies = (data ?? []) as CompanyScore[];
  } else {
    const { data } = await supabase
      .from("company_scores")
      .select("*")
      .order("total_reviews", { ascending: false })
      .limit(20);
    companies = (data ?? []) as CompanyScore[];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {q ? `Results for "${q}"` : industry ? industry : "Browse Companies"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {companies.length} {companies.length === 1 ? "company" : "companies"} found
        </p>
      </div>

      {/* Industry filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/search">
          <Badge
            variant={!industry ? "default" : "outline"}
            className="cursor-pointer text-xs"
          >
            All
          </Badge>
        </Link>
        {INDUSTRIES.slice(0, -1).map((ind) => (
          <Link key={ind} href={`/search?industry=${encodeURIComponent(ind)}`}>
            <Badge
              variant={industry === ind ? "default" : "outline"}
              className="cursor-pointer text-xs"
            >
              {ind}
            </Badge>
          </Link>
        ))}
      </div>

      {companies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.company_id} company={company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No companies found"
          description={
            q
              ? `We don't have any reviews for "${q}" yet. Be the first to share your experience!`
              : "No companies match this filter."
          }
          actionLabel="Share an Experience"
          actionHref={q ? `/submit?company=${encodeURIComponent(q)}` : "/submit"}
        />
      )}
    </div>
  );
}
