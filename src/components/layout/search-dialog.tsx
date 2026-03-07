"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import { CompanyLogo } from "@/components/shared/company-logo";
import Link from "next/link";
import type { SearchResult } from "@/types";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Search companies"
        title="Search (⌘K)"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {open && <SearchOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

export function MobileSearchButton({ onTap }: { onTap?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          onTap?.();
          setOpen(true);
        }}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search companies...
      </button>
      {open && <SearchOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Search
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    async function search() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("search_companies", {
          search_query: debouncedQuery,
          result_limit: 8,
        });
        setResults(data ?? []);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    search();
  }, [debouncedQuery]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
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
        navigate(`/company/${results[activeIndex].slug}`);
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh] backdrop-blur-sm sm:pt-[20vh]"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-label="Search companies"
      aria-modal="true"
    >
      <div className="w-full max-w-lg mx-4 overflow-hidden rounded-xl border bg-background shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4">
          <svg
            className="h-4 w-4 shrink-0 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
            aria-autocomplete="list"
            aria-controls="search-dialog-results"
            aria-activedescendant={
              activeIndex >= 0 ? `search-dialog-result-${activeIndex}` : undefined
            }
          />
          <kbd className="hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground" role="status">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul
              id="search-dialog-results"
              role="listbox"
              aria-label="Search results"
              className="py-2"
            >
              {results.map((result, index) => (
                <li
                  key={result.id}
                  id={`search-dialog-result-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <Link
                    href={`/company/${result.slug}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent ${
                      index === activeIndex ? "bg-accent" : ""
                    }`}
                    onClick={onClose}
                    tabIndex={-1}
                  >
                    <CompanyLogo
                      name={result.name}
                      logoUrl={result.logo_url}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{result.name}</div>
                      {result.industry && (
                        <div className="text-xs text-muted-foreground">
                          {result.industry}
                        </div>
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
          ) : query.length >= 2 && !isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No companies found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Type to search companies...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
