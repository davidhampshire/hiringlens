import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Placeholder background image area */}
      <div className="absolute inset-0 bg-muted/80">
        {/* Placeholder pattern to simulate an image */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Decorative shapes */}
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary/[0.05] blur-3xl" />
      </div>

      {/* Gradient overlay to lift text */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Content - left aligned */}
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-40">
        <div className="animate-in-view max-w-xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-5xl">
            See how companies
            <br />
            <span className="text-foreground/25">really</span> hire
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Hiring should be fair for everyone. When candidates share what
            really happens behind closed doors, companies are held accountable
            and standards improve for all of us.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/submit">Share Your Experience</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/companies">Browse Companies</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Image placeholder label */}
      <div className="absolute right-4 top-4 rounded bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground/50 backdrop-blur-sm">
        Promo Image Placeholder
      </div>
    </section>
  );
}
