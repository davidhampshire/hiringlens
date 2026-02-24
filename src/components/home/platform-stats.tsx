import { createClient } from "@/lib/supabase/server";
import type { CompanyScore } from "@/types";

export async function PlatformStats() {
  const supabase = await createClient();

  const [reviewResult, companyResult] = await Promise.all([
    supabase
      .from("interviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase.from("company_scores").select("reality_score"),
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

  if (totalReviews === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-3 gap-4 rounded-xl border bg-muted/20 p-6">
        <div className="text-center">
          <p className="text-2xl font-bold sm:text-3xl">
            {totalReviews.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Interview Reviews
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold sm:text-3xl">
            {totalCompanies.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Companies Rated
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold sm:text-3xl">{avgScore}</p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Avg Reality Score
          </p>
        </div>
      </div>
    </section>
  );
}
