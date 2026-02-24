import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertisers",
  description:
    "Advertise on HiringLens. Reach engaged candidates and hiring professionals with relevant, non-intrusive ads.",
};

export default function AdvertisersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Advertise on HiringLens</h1>
        <p className="mt-2 text-muted-foreground">
          Reach an engaged audience of candidates and hiring professionals.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold">Why Advertise With Us?</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-primary">Targeted</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Reach candidates actively researching interview processes and
                job opportunities.
              </p>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-primary">Relevant</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your ads appear alongside relevant company and industry content,
                ensuring maximum relevance.
              </p>
            </div>
            <div className="rounded-lg border p-5 text-center">
              <div className="text-3xl font-bold text-primary">Ethical</div>
              <p className="mt-2 text-sm text-muted-foreground">
                We maintain strict separation between ads and editorial content.
                Ads never influence reviews.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Advertising Options</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">&bull;</span>
              <span>
                <strong className="text-foreground">Sponsored placements</strong>{" "}
                &mdash; Featured positions on search results and company
                directory pages.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">&bull;</span>
              <span>
                <strong className="text-foreground">Display ads</strong> &mdash;
                Non-intrusive banner ads on high-traffic pages.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">&bull;</span>
              <span>
                <strong className="text-foreground">
                  Employer branding
                </strong>{" "}
                &mdash; Enhanced company profiles with branding, media, and
                direct links. Coming soon.
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-lg bg-muted/30 p-6 text-center">
          <h2 className="font-semibold">Get Started</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Interested in advertising on HiringLens? Contact our team to discuss
            options and pricing.
          </p>
          <p className="mt-3 text-sm">
            <a
              href="mailto:ads@hiringlens.com"
              className="font-medium text-primary hover:underline"
            >
              ads@hiringlens.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
