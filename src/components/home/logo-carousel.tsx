"use client";

import { useMemo } from "react";
import { CompanyLogo } from "@/components/shared/company-logo";

export interface CarouselCompany {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function LogoCarousel({ companies }: { companies: CarouselCompany[] }) {
  // Shuffle once on mount — different order every page load
  const shuffled = useMemo(() => shuffle(companies), [companies]);

  if (shuffled.length === 0) return null;

  // Duplicate so the marquee loops seamlessly
  const doubled = [...shuffled, ...shuffled];

  return (
    <div
      className="relative w-full overflow-hidden"
      aria-label="Companies on HiringLens"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
      }}
    >
      <div className="animate-marquee flex w-max items-center gap-3 py-1">
        {doubled.map((company, i) => (
          <div
            key={`${company.id}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-lg border bg-background/80 px-3 py-2 backdrop-blur-sm"
          >
            <CompanyLogo
              name={company.name}
              logoUrl={company.logo_url}
              websiteUrl={company.website_url}
              size="sm"
            />
            <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
