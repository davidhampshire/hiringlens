"use client";

import { useState, useTransition } from "react";
import { subscribeToCompany } from "@/lib/actions/watch";

interface WatchCompanyFormProps {
  companyId: string;
  companyName: string;
}

export function WatchCompanyForm({ companyId, companyName }: WatchCompanyFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "already" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      const result = await subscribeToCompany(email, companyId);
      if (!result.success) {
        setStatus("error");
        setErrorMsg(result.error ?? "Something went wrong.");
      } else if (result.alreadySubscribed) {
        setStatus("already");
      } else {
        setStatus("success");
        setEmail("");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium">Watch this company</h3>
        <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/60 px-3 py-3 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            You&apos;re watching {companyName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            We&apos;ll email you when a new review is posted.
          </p>
        </div>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium">Watch this company</h3>
        <div className="rounded-lg border bg-muted/30 px-3 py-3">
          <p className="text-xs text-muted-foreground">
            You&apos;re already watching {companyName}. We&apos;ll notify you when a new review is
            posted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-medium">Watch this company</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Get an email when a new review is posted.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isPending}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        {status === "error" && (
          <p className="text-xs text-red-500">{errorMsg}</p>
        )}
        <button
          type="submit"
          disabled={isPending || !email}
          className="h-9 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Subscribing…" : "Notify me"}
        </button>
      </form>
    </div>
  );
}
