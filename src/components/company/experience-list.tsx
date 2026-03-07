"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExperienceCard } from "./experience-card";
import { fetchFilteredInterviews } from "@/lib/actions/recent";
import { SENIORITY_LABELS, INTERVIEW_TYPE_LABELS } from "@/lib/constants";
import type { Interview } from "@/types";

interface ExperienceListProps {
  companyId: string;
  initialInterviews: Interview[];
  totalCount: number;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";
type FilterOption = "all" | "offer" | "rejected" | "ghosted";

const SORT_OPTIONS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  highest: "Highest rated",
  lowest: "Lowest rated",
};

const FILTER_OPTIONS: Record<FilterOption, string> = {
  all: "All outcomes",
  offer: "Got offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
};

const PAGE_SIZE = 10;

export function ExperienceList({
  companyId,
  initialInterviews,
  totalCount: initialTotal,
}: ExperienceListProps) {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const hasMore = interviews.length < totalCount;
  const hasActiveFilters =
    filterBy !== "all" || seniorityFilter !== "all" || typeFilter !== "all";

  function refetch(
    sort: SortOption,
    outcome: string,
    seniority: string,
    type: string
  ) {
    startTransition(async () => {
      const result = await fetchFilteredInterviews({
        offset: 0,
        limit: PAGE_SIZE,
        sortBy: sort,
        outcome,
        seniority,
        interviewType: type,
        companyId,
      });
      setInterviews(result.data as unknown as Interview[]);
      setTotalCount(result.count);
    });
  }

  function updateFilter(
    newSort: SortOption,
    newOutcome: string,
    newSeniority: string,
    newType: string
  ) {
    setSortBy(newSort);
    setFilterBy(newOutcome as FilterOption);
    setSeniorityFilter(newSeniority);
    setTypeFilter(newType);
    refetch(newSort, newOutcome, newSeniority, newType);
  }

  function clearFilters() {
    updateFilter("newest", "all", "all", "all");
  }

  async function loadMore() {
    setIsLoadingMore(true);
    try {
      const result = await fetchFilteredInterviews({
        offset: interviews.length,
        limit: PAGE_SIZE,
        sortBy,
        outcome: filterBy,
        seniority: seniorityFilter,
        interviewType: typeFilter,
        companyId,
      });
      setInterviews((prev) => [...prev, ...(result.data as unknown as Interview[])]);
      setTotalCount(result.count);
    } catch {
      // Silently handle - user can retry
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (initialInterviews.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No approved reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Interview Experiences ({totalCount})
          </h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs text-muted-foreground"
              >
                Clear filters
              </Button>
            )}
            {/* Grid / List toggle — desktop & tablet only */}
            <div className="hidden items-center rounded-lg border bg-muted/30 p-0.5 sm:flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
                title="Grid view"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-1.5 transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="List view"
                title="List view"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={sortBy}
            onValueChange={(v) =>
              updateFilter(v as SortOption, filterBy, seniorityFilter, typeFilter)
            }
          >
            <SelectTrigger className="h-9 w-[140px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterBy}
            onValueChange={(v) =>
              updateFilter(sortBy, v, seniorityFilter, typeFilter)
            }
          >
            <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FILTER_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={seniorityFilter}
            onValueChange={(v) =>
              updateFilter(sortBy, filterBy, v, typeFilter)
            }
          >
            <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All levels</SelectItem>
              {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(v) =>
              updateFilter(sortBy, filterBy, seniorityFilter, v)
            }
          >
            <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All types</SelectItem>
              {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Experience cards */}
      <div className={`grid gap-3 ${viewMode === "grid" ? "sm:grid-cols-2" : ""}`}>
        {isPending ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg border bg-muted/30" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <ExperienceCard key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="col-span-2 py-6 text-center text-sm text-muted-foreground">
            No experiences match these filters.
          </div>
        )}
      </div>

      {/* Load more — now works with filters */}
      {hasMore && !isPending && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
