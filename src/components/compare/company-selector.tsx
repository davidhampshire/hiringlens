"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import { CompanyLogo } from "@/components/shared/company-logo";
import type { CompanyScore } from "@/types";

interface CompanySelectorProps {
  index: number;
  selected: CompanyScore | null;
  onSelect: (company: CompanyScore | null) => void;
}

interface SearchItem {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  total_reviews: number;
}

export function CompanySelector({ index, selected, onSelect }: CompanySelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    async function search() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("search_companies", {
          search_query: debouncedQuery,
          result_limit: 6,
        });
        setResults(data ?? []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    search();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSelect(item: SearchItem) {
    setIsOpen(false);
    setQuery("");
    // Fetch full company scores
    const supabase = createClient();
    const { data } = await supabase
      .from("company_scores")
      .select("*")
      .eq("slug", item.slug)
      .single();

    if (data) {
      onSelect(data as CompanyScore);
    }
  }

  if (selected) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <CompanyLogo name={selected.name} logoUrl={selected.logo_url} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{selected.name}</p>
          {selected.industry && (
            <p className="text-xs text-muted-foreground">{selected.industry}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {selected.total_reviews} reviews
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Remove"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex h-[72px] items-center rounded-lg border border-dashed bg-muted/30 px-4">
        <div className="flex-1">
          <Input
            placeholder={`Search company ${index + 1}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        {isLoading && (
          <svg className="h-4 w-4 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="py-1">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-accent"
                  onClick={() => handleSelect(result)}
                >
                  <div>
                    <span className="font-medium">{result.name}</span>
                    {result.industry && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {result.industry}
                      </span>
                    )}
                  </div>
                  {result.total_reviews > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {result.total_reviews} reviews
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
