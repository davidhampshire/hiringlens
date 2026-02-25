"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/actions/contact";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mb-3 flex justify-center">
          <svg
            className="h-10 w-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-emerald-800">
          Message sent
        </h3>
        <p className="mt-1 text-sm text-emerald-700">
          Thanks for getting in touch. We aim to respond within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="What is this about?"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us more..."
          rows={5}
          required
          disabled={isPending}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
