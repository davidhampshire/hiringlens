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
    <section className="border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            See how companies{" "}
            <span className="text-primary">really</span> hire
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Real interview experiences from real candidates. Know the process,
            prepare smarter, and interview with confidence.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-lg gap-2">
            <Input
              type="search"
              placeholder="Search a company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 text-base"
            />
            <Button type="submit" size="lg" className="h-11 px-6">
              Search
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            or{" "}
            <Link href="/submit" className="font-medium text-primary hover:underline">
              share your interview experience
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
