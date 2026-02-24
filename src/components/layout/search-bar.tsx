"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { SearchResult } from "@/types";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
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
          result_limit: 5,
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <Input
        type="search"
        placeholder="Search companies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        className="h-9"
      />

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/company/${result.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                  >
                    <div>
                      <span className="font-medium">{result.name}</span>
                      {result.industry && (
                        <span className="ml-2 text-muted-foreground">
                          {result.industry}
                        </span>
                      )}
                    </div>
                    {result.total_reviews > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {result.total_reviews} reviews
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No companies found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
