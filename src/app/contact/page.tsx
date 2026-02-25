import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the HiringLens team. We'd love to hear your feedback, questions, or suggestions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="animate-in-view mb-8">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question, suggestion, or issue? We&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="animate-in-view-d1 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold">Get In Touch</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form and we&apos;ll get back to you within 2 business
              days. You can also reach us directly by email.
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
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
