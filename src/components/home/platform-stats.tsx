import { createClient } from "@/lib/supabase/server";
import type { CompanyScore } from "@/types";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export async function PlatformStats() {
  const supabase = await createClient();

  const [reviewResult, companyResult, industryResult] = await Promise.all([
    supabase
      .from("interviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase.from("company_scores").select("reality_score"),
    supabase.from("companies").select("industry"),
  ]);

  const totalReviews = reviewResult.count ?? 0;
  const companies = (companyResult.data ?? []) as Pick<CompanyScore, "reality_score">[];
  const totalCompanies = companies.length;

  const avgScore =
    totalCompanies > 0
      ? Math.round(
          companies.reduce((sum, c) => sum + (c.reality_score ?? 0), 0) /
            totalCompanies
        )
      : 0;

  const industries = new Set(
    (industryResult.data ?? [])
      .map((c) => (c as { industry: string | null }).industry)
      .filter(Boolean)
  );
  const totalIndustries = industries.size;

  if (totalReviews === 0) return null;

  const stats = [
    { value: totalReviews, label: "Interview Reviews" },
    { value: totalCompanies, label: "Companies Rated" },
    { value: totalIndustries, label: "Industries Covered" },
    { value: avgScore, label: "Avg Reality Score" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-in-view-d1 grid grid-cols-2 gap-4 rounded-xl border bg-muted/20 p-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
