"use client";

import { useState } from "react";
import { CompanySelector } from "@/components/compare/company-selector";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { AdUnit } from "@/components/shared/ad-unit";
import type { CompanyScore } from "@/types";

const MAX_COMPANIES = 3;

export default function ComparePage() {
  const [selections, setSelections] = useState<(CompanyScore | null)[]>([
    null,
    null,
    null,
  ]);

  function handleSelect(index: number, company: CompanyScore | null) {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = company;
      return next;
    });
  }

  const selectedCompanies = selections.filter(
    (c): c is CompanyScore => c !== null
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-5xl font-medium sm:text-6xl">Compare <span className="text-foreground/25">Companies</span></h1>
        <p className="mt-3 text-muted-foreground">
          Select up to {MAX_COMPANIES} companies to compare their interview
          experiences side by side.
        </p>
      </div>

      {/* Company selectors */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {selections.map((selected, i) => (
          <CompanySelector
            key={i}
            index={i}
            selected={selected}
            onSelect={(c) => handleSelect(i, c)}
          />
        ))}
      </div>

      {/* Comparison table */}
      <ComparisonTable companies={selectedCompanies} />

      <AdUnit variant="leaderboard" className="mt-8" />

    </div>
  );
}
