import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section className="border-t bg-gradient-to-b from-muted/40 to-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="animate-in-view grid items-center gap-10 lg:grid-cols-2">
          {/* Text column */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Your experience matters
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Every review helps someone prepare better, avoid red flags, and
              find companies that genuinely respect their candidates. Share yours
              — it only takes a few minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/submit">Share Your Experience</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/companies">Browse Companies</Link>
              </Button>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="flex items-center justify-center">
            <div className="flex h-[300px] w-full max-w-[440px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/15 bg-muted/20">
              <svg
                className="mb-3 h-10 w-10 text-muted-foreground/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-muted-foreground/40">
                Promo Image
              </span>
              <span className="mt-0.5 text-[10px] text-muted-foreground/30">
                440 × 300
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
