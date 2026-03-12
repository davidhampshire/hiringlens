import type { Metadata } from "next";
import {
  MessageSquareText,
  ShieldCheck,
  Building2,
  UserCheck,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Represent Your Company | HiringLens",
  description:
    "Claim your company profile on HiringLens. Respond to candidate reviews, build your employer brand, and show job seekers you value transparency.",
};

const BENEFITS = [
  {
    icon: MessageSquareText,
    title: "Respond to reviews",
    description:
      "Address candidate feedback directly and publicly. Share your perspective on interview processes and hiring decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Verified badge",
    description:
      "Your responses carry a verified badge so candidates know they're hearing from a genuine company representative.",
  },
  {
    icon: Building2,
    title: "Build your reputation",
    description:
      "Companies that engage with feedback are seen as more transparent and candidate-friendly. Stand out from the crowd.",
  },
];

const STEPS = [
  {
    icon: Mail,
    step: "1",
    title: "Get in touch",
    description:
      "Fill out the form below with your company email. Let us know your name, role, and which company you represent.",
  },
  {
    icon: UserCheck,
    step: "2",
    title: "We verify you",
    description:
      "We'll check your email domain matches the company and confirm your identity. This usually takes 1-2 business days.",
  },
  {
    icon: CheckCircle2,
    step: "3",
    title: "Start responding",
    description:
      "Once verified, you'll see a Company Dashboard in your account where you can respond to any review about your company.",
  },
];

export default function RepresentPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="animate-in-view mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          <Building2 className="h-3 w-3" />
          For companies
        </span>
        <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
          Your candidates are{" "}
          <span className="text-foreground/25">talking</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Join the conversation. Verified company representatives can respond to
          candidate reviews, creating a fair and transparent dialogue for
          everyone.
        </p>
      </div>

      {/* Benefits */}
      <div className="animate-in-view-d1 mb-12 grid gap-6 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-lg border bg-card p-6 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <benefit.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold">{benefit.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="animate-in-view-d2 mb-12">
        <h2 className="mb-6 text-center text-lg font-bold uppercase tracking-tight">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.step} className="relative text-center">
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                {step.step}
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact form pre-set to company rep */}
      <div className="animate-in-view-d3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-1 text-lg font-semibold">Register your interest</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Use your company email so we can verify your affiliation.
          </p>
          <ContactForm defaultSubject="company_rep" />
        </div>
      </div>
    </div>
  );
}
