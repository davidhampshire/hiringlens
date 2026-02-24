import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Information",
  description:
    "Manage your data rights on HiringLens. Request access to, correction of, or deletion of your personal data.",
};

export default function MyInformationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Information</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your data and exercise your privacy rights.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold">Your Data Rights</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Under applicable data protection laws (including GDPR and CCPA), you
            have certain rights regarding your personal data. HiringLens is
            committed to respecting these rights.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="mt-3 font-medium">Access Your Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Request a copy of the personal data we hold about you, including
              any submissions and associated technical data.
            </p>
          </div>

          <div className="rounded-lg border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="mt-3 font-medium">Correct Your Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Request corrections to any inaccurate or incomplete personal data.
            </p>
          </div>

          <div className="rounded-lg border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="mt-3 font-medium">Delete Your Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Request deletion of your personal data from our systems. This
              includes submitted reviews and any associated data.
            </p>
          </div>

          <div className="rounded-lg border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <h3 className="mt-3 font-medium">Opt Out</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Opt out of data processing for certain purposes, including
              analytics and personalised advertising.
            </p>
          </div>
        </div>

        <section className="rounded-lg bg-muted/30 p-6">
          <h2 className="font-semibold">How to Make a Request</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            To exercise any of these rights, please contact us at{" "}
            <a
              href="mailto:privacy@hiringlens.com"
              className="text-primary hover:underline"
            >
              privacy@hiringlens.com
            </a>{" "}
            with your request. We will respond within 30 days. A self-service
            data management portal is on our roadmap.
          </p>
        </section>
      </div>
    </div>
  );
}
