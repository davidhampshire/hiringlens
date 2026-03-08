import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-muted/50">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/[0.06] blur-3xl" />

      <div className="relative px-6 py-8 text-center sm:py-10">
        <h3 className="text-xl font-black uppercase tracking-tighter sm:text-2xl">
          Hiring should be <span className="text-foreground/25">fair</span>
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Your honest feedback holds companies accountable and helps other
          candidates know what to expect before they apply.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/submit">Share Your Experience</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/companies">Browse Companies</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
