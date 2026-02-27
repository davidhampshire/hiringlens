"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExperienceCard } from "./experience-card";
import { createClient } from "@/lib/supabase/client";
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
  totalCount,
}: ExperienceListProps) {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const hasMore = interviews.length < totalCount;
  const hasActiveFilters =
    filterBy !== "all" || seniorityFilter !== "all" || typeFilter !== "all";

  function clearFilters() {
    setFilterBy("all");
    setSeniorityFilter("all");
    setTypeFilter("all");
  }

  // Sort and filter the loaded interviews
  const displayedInterviews = useMemo(() => {
    let filtered = [...interviews];

    // Filter by outcome
    if (filterBy !== "all") {
      filtered = filtered.filter((i) => i.outcome === filterBy);
    }

    // Filter by seniority
    if (seniorityFilter !== "all") {
      filtered = filtered.filter((i) => i.seniority === seniorityFilter);
    }

    // Filter by interview type
    if (typeFilter !== "all") {
      filtered = filtered.filter((i) => i.interview_type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "highest": {
          const avgA =
            (a.professionalism_rating + a.communication_rating + a.clarity_rating + a.fairness_rating) / 4;
          const avgB =
            (b.professionalism_rating + b.communication_rating + b.clarity_rating + b.fairness_rating) / 4;
          return avgB - avgA;
        }
        case "lowest": {
          const avgA2 =
            (a.professionalism_rating + a.communication_rating + a.clarity_rating + a.fairness_rating) / 4;
          const avgB2 =
            (b.professionalism_rating + b.communication_rating + b.clarity_rating + b.fairness_rating) / 4;
          return avgA2 - avgB2;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [interviews, sortBy, filterBy, seniorityFilter, typeFilter]);

  async function loadMore() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("interviews")
        .select("*")
        .eq("company_id", companyId)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .range(interviews.length, interviews.length + PAGE_SIZE - 1);

      if (data) {
        setInterviews((prev) => [...prev, ...data]);
      }
    } catch {
      // Silently handle - user can retry
    } finally {
      setIsLoading(false);
    }
  }

  if (interviews.length === 0) {
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
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="h-9 w-[140px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterBy}
            onValueChange={(v) => setFilterBy(v as FilterOption)}
          >
            <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FILTER_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={seniorityFilter}
            onValueChange={setSeniorityFilter}
          >
            <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All levels
              </SelectItem>
              {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All types
              </SelectItem>
              {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Experience cards */}
      <div className="space-y-3">
        {displayedInterviews.length > 0 ? (
          displayedInterviews.map((interview) => (
            <ExperienceCard key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No experiences match these filters.
          </div>
        )}
      </div>

      {hasMore && !hasActiveFilters && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
