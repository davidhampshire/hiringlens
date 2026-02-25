import { createClient } from "@/lib/supabase/server";
import { CompanyCard } from "@/components/shared/company-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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
      <div className="animate-in-view mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Trending Companies</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Most reviewed interview experiences
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/companies">
            All companies <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="animate-in-view-d1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(companies as CompanyScore[]).map((company) => (
          <CompanyCard key={company.company_id} company={company} />
        ))}
      </div>
      <div className="mt-6 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/companies">
            View all companies <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
