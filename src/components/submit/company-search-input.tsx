"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import type { SearchResult } from "@/types";

interface CompanySearchInputProps {
  value: string;
  selectedId?: string;
  onChange: (name: string, id?: string) => void;
  error?: string;
}

export function CompanySearchInput({
  value,
  selectedId,
  onChange,
  error,
}: CompanySearchInputProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue = useDebounce(value, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedValue.length < 2 || selectedId) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    async function search() {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("search_companies", {
          search_query: debouncedValue,
          result_limit: 5,
        });
        setResults(data ?? []);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }

    search();
  }, [debouncedValue, selectedId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-sm font-medium">
        Company <span className="text-destructive">*</span>
      </label>
      <Input
        placeholder="Search or type a company name..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (selectedId) onChange(e.target.value, undefined);
        }}
        onFocus={() => results.length > 0 && setIsOpen(true)}
      />
      {selectedId && (
        <p className="mt-1 text-xs text-emerald-600">Existing company selected</p>
      )}
      {!selectedId && value.length >= 2 && !isOpen && results.length === 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          New company - will be added when you submit
        </p>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="py-1">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    onChange(result.name, result.id);
                    setIsOpen(false);
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
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
