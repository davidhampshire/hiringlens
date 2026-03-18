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
            3. User Content and Accuracy
          </h2>
          <p className="mt-2">
            By submitting content to HiringLens, you grant us a non-exclusive,
            royalty-free, worldwide licence to display, distribute, and
            reproduce your content in connection with the Service. You retain
            ownership of your content.
          </p>
          <p className="mt-2">
            By submitting a review, you explicitly confirm that:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              The content is based on your own genuine, first-hand experience
            </li>
            <li>
              The information provided is truthful and accurate to the best of
              your knowledge
            </li>
            <li>
              You accept sole responsibility for the accuracy of the content you
              submit
            </li>
          </ul>
          <p className="mt-2">
            HiringLens is a neutral hosting platform and is not the author or
            publisher of user-submitted reviews. Reviews that are found to
            contain demonstrably false statements of fact may be amended or
            removed at HiringLens&apos;s sole discretion.
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
          <h2 className="text-lg font-semibold text-foreground">
            8. Governing Law
          </h2>
          <p className="mt-2">
            These Terms shall be governed by and construed in accordance with
            the laws of England and Wales, without regard to conflict of law
            principles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. Company Content Review Process
          </h2>
          <p className="mt-2">
            If you believe a review on HiringLens contains false statements of
            fact about your organisation, you may submit a formal content review
            request to{" "}
            <a
              href="mailto:hiringlensofficial@gmail.com"
              className="text-primary hover:underline"
            >
              hiringlensofficial@gmail.com
            </a>{" "}
            with the subject line &quot;Content Review Request&quot;.
          </p>
          <p className="mt-2">Your request must include:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Your full name and role</li>
            <li>The company you represent</li>
            <li>A link to the specific review</li>
            <li>
              The specific statement(s) you believe to be factually incorrect
            </li>
            <li>Supporting evidence</li>
          </ul>
          <p className="mt-2">
            HiringLens will assess requests in good faith and aims to respond
            within 10 working days. Reviews will not be removed solely on the
            basis of being negative or critical. Verified company representatives
            may also apply for a right of response — contact us at{" "}
            <a
              href="mailto:hiringlensofficial@gmail.com"
              className="text-primary hover:underline"
            >
              hiringlensofficial@gmail.com
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
          <p className="mt-2">
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:hiringlensofficial@gmail.com"
              className="text-primary hover:underline"
            >
              hiringlensofficial@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
