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

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
          {/* Left: Massive headline */}
          <div className="animate-in-view text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
              See how
              <br />
              companies
              <br />
              <span className="text-foreground/25">really</span> hire
            </h1>
          </div>

          {/* Right: Description + Search + Share link */}
          <div className="animate-in-view-d2 text-center lg:text-left">
            <p className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Real interview experiences from real candidates. Holding companies
              accountable and helping you prepare for what&apos;s actually ahead.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-6 flex max-w-md gap-2 lg:mx-0"
            >
              <Input
                type="search"
                placeholder="Search a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" className="h-12 px-6">
                Search
              </Button>
            </form>

            <p className="mt-3 text-sm text-muted-foreground">
              or{" "}
              <Link
                href="/submit"
                className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary"
              >
                share your interview experience
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
