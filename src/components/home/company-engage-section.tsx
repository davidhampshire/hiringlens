import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, MessageSquareText, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Respond to reviews",
    description: "Address candidate feedback directly and show your side of the story",
  },
  {
    icon: ShieldCheck,
    title: "Verified badge",
    description: "Get a verified company badge so candidates know responses are authentic",
  },
  {
    icon: Building2,
    title: "Build your reputation",
    description: "Show candidates you value transparency and take feedback seriously",
  },
];

export function CompanyEngageSection() {
  return (
    <section className="border-t bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="animate-in-view mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <Building2 className="h-3 w-3" />
            For companies
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Your candidates are{" "}
            <span className="text-foreground/25">talking</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Join the conversation. Verified company representatives can respond
            to candidate reviews, creating a fair and transparent dialogue for
            everyone.
          </p>
        </div>

        <div className="animate-in-view-d1 mb-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-background p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="animate-in-view-d2 text-center">
          <Button asChild size="lg">
            <Link href="/represent">Represent Your Company</Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Get in touch and we&apos;ll verify your company affiliation
          </p>
        </div>
      </div>
    </section>
  );
}
