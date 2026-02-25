import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { CompanyLogo } from "@/components/shared/company-logo";
import { OUTCOME_LABELS, SENIORITY_LABELS } from "@/lib/constants";
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

          const date = new Date(review.created_at).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          });

          return (
            <Link key={review.id} href={`/company/${company?.slug ?? ""}`}>
              <Card className="group flex h-full flex-col gap-0 p-0 transition-all hover:shadow-md">
                {/* Company header with prominent logo */}
                <div className="flex items-center gap-3 border-b px-5 py-3">
                  <CompanyLogo
                    name={company?.name ?? "?"}
                    logoUrl={company?.logo_url}
                    size="xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold group-hover:text-primary">
                      {company?.name ?? "Unknown Company"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {review.seniority
                        ? SENIORITY_LABELS[review.seniority]
                        : null}
                      {review.seniority && review.location ? " · " : ""}
                      {review.location ?? ""}
                      {!review.seniority && !review.location ? date : ""}
                    </p>
                  </div>
                  <StarRating rating={avgRating} size="sm" showValue />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{review.role_title}</p>
                    {Date.now() - new Date(review.created_at).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                      <Badge className="bg-blue-100 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    by {review.display_name || "Anonymous"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
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
                    {review.total_duration_days && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {review.total_duration_days} days
                      </Badge>
                    )}
                  </div>

                  {/* Comments preview */}
                  {review.overall_comments && (() => {
                    const idx = review.overall_comments!.indexOf("---FOLLOW_UP_DATA---");
                    const cleaned = idx === -1 ? review.overall_comments : review.overall_comments!.substring(0, idx).trim();
                    return cleaned ? (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {cleaned}
                      </p>
                    ) : null;
                  })()}

                  {/* Tip */}
                  {review.candidate_tip && (
                    <div className="mt-auto pt-3">
                      <div className="rounded-md bg-muted/30 px-3 py-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Tip for candidates:
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-sm">
                          &ldquo;{review.candidate_tip}&rdquo;
                        </p>
                      </div>
                    </div>
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
