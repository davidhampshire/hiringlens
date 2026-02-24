import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for HiringLens.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By accessing or using HiringLens (&quot;the Service&quot;), you
            agree to be bound by these Terms of Use. If you do not agree to
            these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Use of the Service
          </h2>
          <p className="mt-2">
            HiringLens provides a platform for users to share and browse
            anonymous interview experiences. You may use the Service for
            personal, non-commercial purposes in accordance with these Terms and
            our Community Guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. User Content
          </h2>
          <p className="mt-2">
            By submitting content to HiringLens, you grant us a non-exclusive,
            royalty-free, worldwide licence to display, distribute, and
            reproduce your content in connection with the Service. You retain
            ownership of your content. You represent that your submissions are
            truthful, based on genuine experiences, and do not violate our
            Community Guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Prohibited Conduct
          </h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Submit false, misleading, or fabricated reviews</li>
            <li>Harass, defame, or attack individuals</li>
            <li>Share confidential or proprietary information</li>
            <li>Attempt to manipulate ratings or reviews</li>
            <li>Use automated systems to access the Service</li>
            <li>Interfere with the operation of the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Disclaimer
          </h2>
          <p className="mt-2">
            HiringLens is provided &quot;as is&quot; without warranties of any
            kind, either express or implied. We do not guarantee the accuracy,
            completeness, or reliability of any content on the platform.
            Interview experiences are subjective and may not reflect the current
            practices of any company.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Limitation of Liability
          </h2>
          <p className="mt-2">
            To the maximum extent permitted by law, HiringLens shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Modifications
          </h2>
          <p className="mt-2">
            We reserve the right to modify these Terms at any time. Continued
            use of the Service after changes constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Contact</h2>
          <p className="mt-2">
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:legal@hiringlens.com"
              className="text-primary hover:underline"
            >
              legal@hiringlens.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
