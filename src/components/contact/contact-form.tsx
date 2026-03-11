"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactMessage } from "@/lib/actions/contact";
import { toast } from "sonner";

const SUBJECT_OPTIONS = [
  { value: "general", label: "General enquiry" },
  { value: "feedback", label: "Feedback or suggestion" },
  { value: "report", label: "Report an issue" },
  { value: "company_rep", label: "I represent a company" },
  { value: "other", label: "Other" },
];

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    null
  );
  const toastShown = useRef(false);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (state?.success && !toastShown.current) {
      toast.success("Message sent successfully!");
      toastShown.current = true;
    }
  }, [state?.success]);

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
        <Select
          name="subject"
          value={subject}
          onValueChange={setSubject}
          disabled={isPending}
          required
        >
          <SelectTrigger id="subject">
            <SelectValue placeholder="What is this about?" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subject === "company_rep" && (
        <div className="space-y-2 rounded-md border border-blue-200 bg-blue-50/50 p-3">
          <Label htmlFor="company_name">Company name</Label>
          <Input
            id="company_name"
            name="company_name"
            placeholder="e.g. Acme Corp"
            required
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            We&apos;ll verify your email domain matches the company before
            granting access to respond to reviews.
          </p>
        </div>
      )}

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
