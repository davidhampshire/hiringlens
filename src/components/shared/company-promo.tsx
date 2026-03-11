import Link from "next/link";
import { Button } from "@/components/ui/button";

type Variant = "homepage" | "reviews" | "directory";

const VARIANTS: Record<
  Variant,
  {
    heading: string;
    body: string;
    cta1: { label: string; href: string };
    cta2: { label: string; href: string };
  }
> = {
  homepage: {
    heading: "Are you a company?",
    body: "Own your hiring reputation. Respond to candidate reviews, share insights on your process, and show the world how you really hire. Blog and company profiles coming soon.",
    cta1: { label: "Get Involved", href: "/contact" },
    cta2: { label: "Learn More", href: "/guidelines" },
  },
  reviews: {
    heading: "Companies: your candidates are talking",
    body: "Join HiringLens to respond to reviews, provide context on your hiring process, and share tips and advice on the HiringLens blog (coming soon).",
    cta1: { label: "Claim Your Profile", href: "/contact" },
    cta2: { label: "How It Works", href: "/guidelines" },
  },
  directory: {
    heading: "Is your company listed?",
    body: "Claim your company profile to respond to reviews, share deeper insights into your hiring process, and contribute to the HiringLens blog (coming soon).",
    cta1: { label: "Get Started", href: "/contact" },
    cta2: { label: "Learn More", href: "/guidelines" },
  },
};

interface CompanyPromoProps {
  variant: Variant;
}

export function CompanyPromo({ variant }: CompanyPromoProps) {
  const { heading, body, cta1, cta2 } = VARIANTS[variant];

  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-200/50 bg-indigo-50/60">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-indigo-400/[0.07] blur-3xl" />

      <div className="relative px-6 py-8 text-center sm:py-10">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          For Companies
        </span>

        <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
          {heading}
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href={cta1.href}>{cta1.label}</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
          >
            <Link href={cta2.href}>{cta2.label}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
