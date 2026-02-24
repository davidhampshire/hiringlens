import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Ad Choices",
  description:
    "HiringLens privacy policy and ad choices. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Privacy & Ad Choices</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Data We Collect
          </h2>
          <p className="mt-2">
            HiringLens collects minimal data to operate the platform:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong className="text-foreground">Submitted reviews:</strong>{" "}
              The content you voluntarily submit, including ratings, comments,
              and tips. No personal identification is required.
            </li>
            <li>
              <strong className="text-foreground">Usage data:</strong> Basic
              analytics such as page views and interaction patterns to improve
              the Service.
            </li>
            <li>
              <strong className="text-foreground">Technical data:</strong>{" "}
              Browser type, device information, and IP address for security and
              anti-abuse purposes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. How We Use Your Data
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>To display and aggregate interview experiences</li>
            <li>To calculate Reality Scores and company statistics</li>
            <li>To moderate content and prevent abuse</li>
            <li>To improve the platform and user experience</li>
            <li>To communicate with you if you contact us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Cookies</h2>
          <p className="mt-2">
            We use essential cookies to ensure the platform functions correctly.
            We may also use analytics cookies to understand how the platform is
            used. You can manage your cookie preferences at any time. See our{" "}
            <a href="/cookies" className="text-primary hover:underline">
              Cookie Consent
            </a>{" "}
            page for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Third Parties
          </h2>
          <p className="mt-2">
            We do not sell your personal data to third parties. We may share
            anonymised, aggregated data for analytics purposes. Our
            infrastructure partners (hosting, database) process data on our
            behalf under strict data processing agreements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Ad Choices
          </h2>
          <p className="mt-2">
            HiringLens may display advertisements to support the platform. We
            aim to show relevant, non-intrusive ads. You can opt out of
            personalised advertising through your browser settings or by
            contacting us. We do not use personal data from reviews for ad
            targeting.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Your Rights
          </h2>
          <p className="mt-2">
            Depending on your location, you may have the right to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of data processing for certain purposes</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, visit our{" "}
            <a
              href="/my-information"
              className="text-primary hover:underline"
            >
              My Information
            </a>{" "}
            page or contact us at{" "}
            <a
              href="mailto:privacy@hiringlens.com"
              className="text-primary hover:underline"
            >
              privacy@hiringlens.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Data Retention
          </h2>
          <p className="mt-2">
            We retain submitted reviews indefinitely to maintain the integrity
            of company scores and historical data. Technical and usage data is
            retained for up to 12 months. You may request deletion at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Contact</h2>
          <p className="mt-2">
            For privacy-related enquiries, contact us at{" "}
            <a
              href="mailto:privacy@hiringlens.com"
              className="text-primary hover:underline"
            >
              privacy@hiringlens.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
