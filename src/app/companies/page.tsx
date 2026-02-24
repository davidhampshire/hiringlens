import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CompanyCard } from "@/components/shared/company-card";
import { LetterNav } from "@/components/companies/letter-nav";
import { EmptyState } from "@/components/shared/empty-state";
import type { CompanyScore } from "@/types";

export const metadata: Metadata = {
  title: "Company Directory",
  description:
    "Browse all rated companies alphabetically. Find interview experiences, Reality Scores, and candidate tips for companies across every industry.",
};

export const revalidate = 3600; // 1 hour ISR

function groupByLetter(companies: CompanyScore[]) {
  const grouped = new Map<string, CompanyScore[]>();

  for (const company of companies) {
    const firstChar = company.name[0].toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter)!.push(company);
  }

  // Sort map by key
  return new Map(
    [...grouped.entries()].sort((a, b) => {
      if (a[0] === "#") return -1;
      if (b[0] === "#") return 1;
      return a[0].localeCompare(b[0]);
    })
  );
}

export default async function CompaniesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("company_scores")
    .select("*")
    .order("name", { ascending: true });

  const companies = (data ?? []) as CompanyScore[];

  if (companies.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Company Directory</h1>
        </div>
        <EmptyState
          title="No companies yet"
          description="No companies have been rated yet. Be the first to share your interview experience!"
          actionLabel="Share an Experience"
          actionHref="/submit"
        />
      </div>
    );
  }

  const grouped = groupByLetter(companies);
  const availableLetters = new Set(grouped.keys());

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all {companies.length} rated companies alphabetically. Click a
          letter to jump to that section.
        </p>
      </div>

      <LetterNav availableLetters={availableLetters} />

      <div className="mt-6 space-y-10">
        {Array.from(grouped.entries()).map(([letter, letterCompanies]) => (
          <section
            key={letter}
            id={`letter-${letter}`}
            className="scroll-mt-36"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                {letter}
              </span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">
                {letterCompanies.length}{" "}
                {letterCompanies.length === 1 ? "company" : "companies"}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {letterCompanies.map((company) => (
                <CompanyCard key={company.company_id} company={company} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
