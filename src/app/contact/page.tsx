import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the HiringLens team. We'd love to hear your feedback, questions, or suggestions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question, suggestion, or issue? We&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold">Get In Touch</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The quickest way to reach us is via email. We aim to respond
              within 2 business days.
            </p>
          </section>

          <section>
            <h3 className="font-medium">General Enquiries</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              hello@hiringlens.com
            </p>
          </section>

          <section>
            <h3 className="font-medium">Press & Media</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              press@hiringlens.com
            </p>
          </section>

          <section>
            <h3 className="font-medium">Report an Issue</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If you&apos;ve found a bug or need to report content, email us at
              support@hiringlens.com or use the &quot;Report&quot; button on any
              review.
            </p>
          </section>

          <section>
            <h3 className="font-medium">Social</h3>
            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
              <span>Twitter / X</span>
              <span>LinkedIn</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Social links coming soon.
            </p>
          </section>
        </div>

        <div className="rounded-lg border bg-muted/20 p-6">
          <h2 className="text-lg font-semibold">Send a Message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form coming soon. In the meantime, please email us directly.
          </p>
          <div className="mt-4 space-y-3">
            <div className="h-10 rounded-md border bg-background" />
            <div className="h-10 rounded-md border bg-background" />
            <div className="h-24 rounded-md border bg-background" />
            <div className="h-10 w-28 rounded-md bg-muted" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Form functionality is under development.
          </p>
        </div>
      </div>
    </div>
  );
}
