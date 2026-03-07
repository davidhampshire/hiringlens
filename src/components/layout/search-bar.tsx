"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import { CompanyLogo } from "@/components/shared/company-logo";
import Link from "next/link";
import type { SearchResult } from "@/types";

const LISTBOX_ID = "search-results-listbox";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
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
          result_limit: 5,
        });
        setResults(data ?? []);
        setIsOpen(true);
        setActiveIndex(-1);
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
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && results.length > 0) setIsOpen(true);
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      return;
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < results.length) {
        const result = results[activeIndex];
        setIsOpen(false);
        setQuery("");
        setActiveIndex(-1);
        router.push(`/company/${result.slug}`);
      } else if (query.trim()) {
        setIsOpen(false);
        setActiveIndex(-1);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-xs"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns={LISTBOX_ID}
    >
      <Input
        type="search"
        placeholder="Search companies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        className="h-9"
        aria-autocomplete="list"
        aria-controls={LISTBOX_ID}
        aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
      />

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground" role="status">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul id={LISTBOX_ID} role="listbox" aria-label="Search results" className="py-1">
              {results.map((result, index) => (
                <li
                  key={result.id}
                  id={`search-result-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <Link
                    href={`/company/${result.slug}`}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent ${index === activeIndex ? "bg-accent" : ""}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                      setActiveIndex(-1);
                    }}
                    tabIndex={-1}
                  >
                    <CompanyLogo
                      name={result.name}
                      logoUrl={result.logo_url}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">{result.name}</span>
                      {result.industry && (
                        <span className="ml-2 text-muted-foreground">
                          {result.industry}
                        </span>
                      )}
                    </div>
                    {result.total_reviews > 0 && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {result.total_reviews} reviews
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground" role="status">
              No companies found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
