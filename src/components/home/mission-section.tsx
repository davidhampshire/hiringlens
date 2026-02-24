import Link from "next/link";

const VALUES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Celebrate great companies",
    description:
      "Not every company gets it wrong. We highlight the ones that run respectful, transparent processes so candidates know where to focus their energy.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Flag the red flags",
    description:
      "Ghosted after the final round? Asked to do hours of unpaid work? These patterns need to be visible so candidates can make informed choices.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Help each other prepare",
    description:
      "Tips from candidates who've been through it. What to expect, how to prepare, and what the process is really like — from people who've sat in that chair.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Push for better standards",
    description:
      "Every review is a signal. When enough candidates share their experiences, companies have a real incentive to treat people better throughout the process.",
  },
];

export function MissionSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Why HiringLens exists
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Interviewing is stressful. People invest real time and emotional energy
          into every application. We believe they deserve to know what
          they&apos;re walking into &mdash; and companies should be held to a
          higher standard.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {VALUES.map((value) => (
          <div
            key={value.title}
            className="flex gap-4 rounded-lg border bg-card p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {value.icon}
            </div>
            <div>
              <h3 className="font-semibold">{value.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Had an interview recently?{" "}
          <Link
            href="/submit"
            className="font-medium text-primary hover:underline"
          >
            Share your experience
          </Link>{" "}
          &mdash; it only takes a few minutes and it helps everyone.
        </p>
      </div>
    </section>
  );
}
