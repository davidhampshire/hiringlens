import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Consent",
  description:
    "Learn about how HiringLens uses cookies and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Cookie Consent</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            What Are Cookies?
          </h2>
          <p className="mt-2">
            Cookies are small text files stored on your device when you visit a
            website. They help the site remember your preferences and understand
            how you interact with the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Cookies We Use
          </h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-foreground">
                Essential Cookies
              </h3>
              <p className="mt-1">
                Required for the platform to function. These handle things like
                session management and security. They cannot be disabled.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-foreground">
                Analytics Cookies
              </h3>
              <p className="mt-1">
                Help us understand how visitors interact with HiringLens, which
                pages are most popular, and where users encounter issues. This
                data is anonymised and used to improve the platform.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-foreground">
                Preference Cookies
              </h3>
              <p className="mt-1">
                Remember your choices such as filter preferences, sort options,
                and display settings to provide a more personalised experience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Managing Cookies
          </h2>
          <p className="mt-2">
            You can manage cookies through your browser settings. Most browsers
            allow you to block or delete cookies. Please note that disabling
            essential cookies may affect the functionality of the platform.
          </p>
          <p className="mt-2">
            A cookie preference centre is coming soon, which will allow you to
            manage your consent directly on HiringLens.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Third-Party Cookies
          </h2>
          <p className="mt-2">
            We may use third-party services (such as analytics providers) that
            set their own cookies. These are governed by the respective
            third-party privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Questions?</h2>
          <p className="mt-2">
            For questions about our use of cookies, contact us at{" "}
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
