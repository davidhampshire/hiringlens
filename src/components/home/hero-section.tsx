"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/60 to-background">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-foreground/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
        {/* Headline */}
        <h1 className="animate-in-view text-4xl font-medium leading-[1.05] text-foreground sm:text-7xl lg:text-8xl">
          See how
          <br />
          companies
          <br />
          <span className="text-foreground/25">really</span> hire
        </h1>

        {/* Subtext — constrained to ~two lines on desktop */}
        <p className="animate-in-view-d2 mx-auto mt-8 max-w-sm text-base leading-relaxed text-muted-foreground sm:max-w-2xl sm:text-lg">
          Real interview experiences from real candidates. Holding companies
          accountable and helping you prepare for what&apos;s actually ahead.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="animate-in-view-d2 mx-auto mt-8 flex max-w-lg flex-col gap-2 sm:flex-row"
        >
          <Input
            type="search"
            placeholder="Search a company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 text-base"
          />
          <Button type="submit" size="lg" className="h-12 w-full px-6 sm:w-auto">
            Search
          </Button>
        </form>

        <p className="animate-in-view-d2 mt-4 text-sm text-muted-foreground">
          or{" "}
          <Link
            href="/submit"
            className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary"
          >
            share your interview experience
          </Link>
        </p>
      </div>
    </section>
  );
}
