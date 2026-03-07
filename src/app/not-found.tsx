import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function NotFound() {
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from("company_scores")
    .select("name, slug, total_reviews")
    .gt("total_reviews", 0)
    .order("total_reviews", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mb-6 text-6xl font-bold text-muted-foreground/30">404</div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/recent">Browse Reviews</Link>
        </Button>
      </div>

      {companies && companies.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Popular Companies
          </h2>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {companies.map((c) => (
              <Link
                key={c.slug}
                href={`/company/${c.slug}`}
                className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
