import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { CompanyLogo } from "@/components/shared/company-logo";
import { OUTCOME_LABELS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import type { Interview } from "@/types";
import Link from "next/link";

type ReviewWithCompany = Interview & {
  companies: { name: string; slug: string; logo_url: string | null } | null;
};

export async function RecentReviews() {
  const supabase = await createClient();

  // RLS limits to approved interviews only
  const { data } = await supabase
    .from("interviews")
    .select("*, companies(name, slug, logo_url)")
    .order("created_at", { ascending: false })
    .limit(9);

  const reviews = (data ?? []) as unknown as ReviewWithCompany[];

  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recent Experiences</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest interview insights from candidates
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/recent">
            All experiences <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => {
          const company = review.companies;
          const avgRating =
            (review.professionalism_rating +
              review.communication_rating +
              review.clarity_rating +
              review.fairness_rating) /
            4;

          return (
            <Link key={review.id} href={`/company/${company?.slug ?? ""}`}>
              <Card className="group gap-0 p-0 transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <CompanyLogo
                        name={company?.name ?? "?"}
                        logoUrl={company?.logo_url}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold group-hover:text-primary">
                          {company?.name ?? "Unknown Company"}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {review.role_title}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={avgRating} size="sm" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {review.outcome && (
                      <Badge
                        variant={review.outcome === "offer" ? "default" : "secondary"}
                        className="text-xs font-normal"
                      >
                        {OUTCOME_LABELS[review.outcome] ?? review.outcome}
                      </Badge>
                    )}
                    {review.ghosted && (
                      <Badge variant="destructive" className="text-xs font-normal">
                        Ghosted
                      </Badge>
                    )}
                    {review.stages_count && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {review.stages_count} stages
                      </Badge>
                    )}
                  </div>

                  {review.candidate_tip && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      &ldquo;{review.candidate_tip}&rdquo;
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/recent">
            View all experiences <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
