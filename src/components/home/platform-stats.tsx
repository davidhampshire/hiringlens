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
    <section className="relative z-10 mx-auto -mt-14 max-w-5xl px-4 sm:-mt-16 sm:px-6">
      <div className="animate-in-view-d2 rounded-2xl border bg-card shadow-xl">
        <div className="grid grid-cols-2 divide-x divide-border p-5 sm:grid-cols-4 sm:p-7">
          {stats.map((stat) => (
            <div key={stat.label} className="px-3 text-center sm:px-4">
              <p className="text-2xl font-medium sm:text-3xl lg:text-4xl">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="border-t px-5 py-2.5 text-center text-xs font-medium text-muted-foreground/70">
          And growing — powered by real candidates like you
        </p>
      </div>
    </section>
  );
}
