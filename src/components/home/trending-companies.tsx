import { createClient } from "@/lib/supabase/server";
import { CompanyCard } from "@/components/shared/company-card";
import type { CompanyScore } from "@/types";

export async function TrendingCompanies() {
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from("company_scores")
    .select("*")
    .order("total_reviews", { ascending: false })
    .limit(6);

  if (!companies || companies.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Trending Companies</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Most reviewed interview experiences
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(companies as CompanyScore[]).map((company) => (
          <CompanyCard key={company.company_id} company={company} />
        ))}
      </div>
    </section>
  );
}
