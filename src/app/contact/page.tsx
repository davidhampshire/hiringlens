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
        <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">Contact <span className="text-foreground/25">Us</span></h1>
        <p className="mt-2 text-muted-foreground">
          Have a question, suggestion, or issue? We&apos;d love to hear from
          you. Fill out the form below and we&apos;ll get back to you within 2 business days.
        </p>
      </div>

      <div className="animate-in-view-d1 space-y-8">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <section>
            <h3 className="font-medium">General Enquiries</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              hiringlensofficial@gmail.com
            </p>
          </section>

          <section>
            <h3 className="font-medium">Press & Media</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              hiringlensofficial@gmail.com
            </p>
          </section>

          <section>
            <h3 className="font-medium">Report an Issue</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              hiringlensofficial@gmail.com
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
