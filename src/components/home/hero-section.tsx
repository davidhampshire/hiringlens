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
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-background/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:pb-36 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-12">
          {/* Left: Massive headline */}
          <div className="animate-in-view">
            <h1 className="text-[2.75rem] font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl lg:text-[5.5rem]">
              See how
              <br />
              companies
              <br />
              <span className="text-background/40">really</span> hire
            </h1>
          </div>

          {/* Right: Description + Search, offset */}
          <div className="animate-in-view-d1 lg:pb-3">
            <p className="max-w-sm text-base leading-relaxed text-background/60 sm:text-lg">
              Real interview experiences from real candidates. Know the process,
              prepare smarter, and interview with confidence.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-6 flex max-w-md gap-2"
            >
              <Input
                type="search"
                placeholder="Search a company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 border-background/15 bg-background/10 text-base text-background placeholder:text-background/30 focus-visible:border-background/30 focus-visible:ring-background/20"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-background px-6 text-foreground hover:bg-background/90"
              >
                Search
              </Button>
            </form>

            <p className="mt-3 text-sm text-background/40">
              or{" "}
              <Link
                href="/submit"
                className="font-medium text-background/70 underline underline-offset-2 transition-colors hover:text-background"
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
