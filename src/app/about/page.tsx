import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About HiringLens",
  description:
    "HiringLens brings transparency to the hiring process. Learn how we help candidates prepare with real interview experiences and Reality Scores.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">About HiringLens</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Bringing transparency to the hiring process
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold">Our Mission</h2>
          <p className="mt-2 text-muted-foreground">
            Candidates routinely face poor interview experiences &mdash;
            ghosting, unpaid tasks, unclear processes &mdash; but have no
            dedicated place to share structured feedback. HiringLens creates a
            transparency layer focused entirely on interview experiences, helping
            candidates prepare and encouraging employers to improve.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">How It Works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mt-3 font-medium">Share</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Candidates submit anonymous, structured reviews of their
                interview experience with any company.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mt-3 font-medium">Review</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Every submission is reviewed before publishing to maintain
                quality and prevent abuse.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mt-3 font-medium">Discover</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse Reality Scores, ratings, red flags, and candidate tips to
                prepare for your next interview.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">The Reality Score</h2>
          <p className="mt-2 text-muted-foreground">
            Every company receives a Reality Score from 0 to 100 based on four
            rating dimensions (professionalism, communication, clarity,
            fairness) with penalties for red flags like ghosting, unpaid work,
            and exceeded timelines. It&apos;s a single number that tells you
            what to really expect.
          </p>
        </section>

        <section className="rounded-lg bg-muted/30 p-6 text-center">
          <h2 className="text-lg font-semibold">
            Ready to share your experience?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Help other candidates by sharing honest feedback about an interview
            process you&apos;ve been through.
          </p>
          <Button asChild className="mt-4">
            <Link href="/submit">Share Your Experience</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
