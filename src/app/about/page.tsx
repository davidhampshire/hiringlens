import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About HiringLens",
  description:
    "HiringLens champions transparency in hiring. We spotlight great companies, flag the red flags, and help candidates support each other through the interview process.",
};

const VALUES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Celebrate great companies",
    description:
      "Plenty of companies get hiring right. We make sure they get recognised for treating candidates with respect, communicating clearly, and running fair processes.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Expose the patterns",
    description:
      "Ghosting after the final round. Hours of unpaid take-home work. Zero feedback after weeks of effort. These patterns need to be visible so candidates can make informed choices.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Build a community",
    description:
      "Real tips from people who've sat in that chair. What to expect, how to prepare, and what the process is actually like &mdash; from candidates helping candidates.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Raise the bar",
    description:
      "Every review is a signal. When enough candidates share their experiences, companies have a real incentive to do better. We want hiring to improve for everyone.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">About HiringLens</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Championing transparency in hiring &mdash; for candidates and
          companies alike
        </p>
      </div>

      <div className="space-y-10">
        {/* The Problem */}
        <section>
          <h2 className="text-lg font-semibold">The Problem</h2>
          <p className="mt-2 text-muted-foreground">
            Interviewing is stressful. Candidates invest real time and emotional
            energy into every application &mdash; researching the company,
            preparing for interviews, completing take-home tasks &mdash; only to
            be ghosted after reaching the final two, or to discover that the
            process wasn&apos;t what they expected. There&apos;s no dedicated
            place to share structured feedback about these experiences, so the
            same patterns repeat.
          </p>
        </section>

        {/* Our Mission */}
        <section>
          <h2 className="text-lg font-semibold">Our Mission</h2>
          <p className="mt-2 text-muted-foreground">
            We believe candidates deserve to know what they&apos;re walking into,
            and companies that treat people well deserve recognition. HiringLens
            exists to spotlight the companies doing it right, flag the ones that
            aren&apos;t, and give candidates a space to help each other through
            one of the most important processes in their careers.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="flex gap-3 rounded-lg border bg-card p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-medium">{value.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-lg font-semibold">How It Works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mt-3 font-medium">Share</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Been through an interview? Share a structured review of the
                experience &mdash; the good, the bad, and the tips you wish
                you&apos;d had.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mt-3 font-medium">Review</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Every submission is moderated before publishing to maintain
                quality, fairness, and prevent abuse. We want honest feedback,
                not hit pieces.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mt-3 font-medium">Discover</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse Reality Scores, ratings, red flags, and candidate tips
                to find great companies and prepare for your next interview.
              </p>
            </div>
          </div>
        </section>

        {/* The Reality Score */}
        <section>
          <h2 className="text-lg font-semibold">The Reality Score</h2>
          <p className="mt-2 text-muted-foreground">
            Every company receives a Reality Score from 0 to 100 based on four
            dimensions &mdash; professionalism, communication, clarity, and
            fairness &mdash; with penalties for red flags like ghosting, unpaid
            work, and exceeded timelines. It&apos;s a single number that cuts
            through the noise and tells you what to actually expect when you
            apply.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Professionalism", "Communication", "Clarity", "Fairness"].map(
              (dimension) => (
                <div
                  key={dimension}
                  className="rounded-lg border bg-muted/30 p-3 text-center"
                >
                  <p className="text-sm font-medium">{dimension}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-lg bg-muted/30 p-6 text-center">
          <h2 className="text-lg font-semibold">
            Had an interview recently?
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Your experience matters. Whether it was brilliant or terrible, sharing
            it helps the next person walking into that room &mdash; and it pushes
            companies to do better.
          </p>
          <Button asChild className="mt-4">
            <Link href="/submit">Share Your Experience</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
