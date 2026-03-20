"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExperienceCard } from "@/components/company/experience-card";
import { fetchFilteredInterviews } from "@/lib/actions/recent";
import {
  OUTCOME_LABELS,
  INDUSTRIES,
  SENIORITY_LABELS,
  INTERVIEW_TYPE_LABELS,
} from "@/lib/constants";
import type { Interview } from "@/types";

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string; industry: string | null; logo_url: string | null } | null;
};

interface RecentPostsListProps {
  initialPosts: InterviewWithCompany[];
  totalCount: number;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";

const SORT_OPTIONS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  highest: "Highest rated",
  lowest: "Lowest rated",
};

const PAGE_SIZE = 30;

export function RecentPostsList({
  initialPosts,
  totalCount: initialTotal,
}: RecentPostsListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<InterviewWithCompany[]>(initialPosts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Read initial filters from URL params
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [outcomeFilter, setOutcomeFilter] = useState(searchParams.get("outcome") || "all");
  const [industryFilter, setIndustryFilter] = useState(searchParams.get("industry") || "all");
  const [seniorityFilter, setSeniorityFilter] = useState(searchParams.get("seniority") || "all");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("hl-view-mode") as "grid" | "list") || "grid";
    }
    return "grid";
  });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("hl-view-mode", viewMode);
  }, [viewMode]);

  const hasMore = posts.length < totalCount;

  const activeFilterCount = [
    outcomeFilter,
    industryFilter,
    seniorityFilter,
    typeFilter,
  ].filter((f) => f !== "all").length;

  function refetch(
    sort: SortOption,
    outcome: string,
    industry: string,
    seniority: string,
    type: string
  ) {
    startTransition(async () => {
      const result = await fetchFilteredInterviews({
        offset: 0,
        limit: PAGE_SIZE,
        sortBy: sort,
        outcome,
        industry,
        seniority,
        interviewType: type,
      });
      setPosts(result.data as unknown as InterviewWithCompany[]);
      setTotalCount(result.count);
    });
  }

  // Sync filters to URL params
  const syncUrlParams = useCallback(
    (sort: string, outcome: string, industry: string, seniority: string, type: string) => {
      const params = new URLSearchParams();
      if (sort !== "newest") params.set("sort", sort);
      if (outcome !== "all") params.set("outcome", outcome);
      if (industry !== "all") params.set("industry", industry);
      if (seniority !== "all") params.set("seniority", seniority);
      if (type !== "all") params.set("type", type);
      const qs = params.toString();
      router.replace(qs ? `/recent?${qs}` : "/recent", { scroll: false });
    },
    [router]
  );

  // Fetch filtered data on mount if URL params were set
  useEffect(() => {
    const hasUrlFilters = sortBy !== "newest" || outcomeFilter !== "all" || industryFilter !== "all" || seniorityFilter !== "all" || typeFilter !== "all";
    if (hasUrlFilters) {
      refetch(sortBy, outcomeFilter, industryFilter, seniorityFilter, typeFilter);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateFilter(
    newSort: SortOption,
    newOutcome: string,
    newIndustry: string,
    newSeniority: string,
    newType: string
  ) {
    setSortBy(newSort);
    setOutcomeFilter(newOutcome);
    setIndustryFilter(newIndustry);
    setSeniorityFilter(newSeniority);
    setTypeFilter(newType);
    setOpenIndex(null);
    refetch(newSort, newOutcome, newIndustry, newSeniority, newType);
    syncUrlParams(newSort, newOutcome, newIndustry, newSeniority, newType);
  }

  function clearFilters() {
    updateFilter("newest", "all", "all", "all", "all");
  }

  async function loadMore() {
    setIsLoadingMore(true);
    try {
      const result = await fetchFilteredInterviews({
        offset: posts.length,
        limit: PAGE_SIZE,
        sortBy,
        outcome: outcomeFilter,
        industry: industryFilter,
        seniority: seniorityFilter,
        interviewType: typeFilter,
      });
      setPosts((prev) => [
        ...prev,
        ...(result.data as unknown as InterviewWithCompany[]),
      ]);
      setTotalCount(result.count);
    } catch {
      // Silently handle - user can retry
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter bar — 2-col grid on mobile, single row on sm+ */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Select
          value={sortBy}
          onValueChange={(v) =>
            updateFilter(v as SortOption, outcomeFilter, industryFilter, seniorityFilter, typeFilter)
          }
        >
          <SelectTrigger className="h-9 w-full bg-background text-xs sm:w-[140px]">
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
          value={outcomeFilter}
          onValueChange={(v) =>
            updateFilter(sortBy, v, industryFilter, seniorityFilter, typeFilter)
          }
        >
          <SelectTrigger className="h-9 w-full bg-background text-xs sm:w-[130px]">
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All outcomes</SelectItem>
            {Object.entries(OUTCOME_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={industryFilter}
          onValueChange={(v) =>
            updateFilter(sortBy, outcomeFilter, v, seniorityFilter, typeFilter)
          }
        >
          <SelectTrigger className="h-9 w-full bg-background text-xs sm:w-[150px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All industries</SelectItem>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry} className="text-xs">{industry}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={seniorityFilter}
          onValueChange={(v) =>
            updateFilter(sortBy, outcomeFilter, industryFilter, v, typeFilter)
          }
        >
          <SelectTrigger className="h-9 w-full bg-background text-xs sm:w-[130px]">
            <SelectValue placeholder="Seniority" />
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
            updateFilter(sortBy, outcomeFilter, industryFilter, seniorityFilter, v)
          }
        >
          <SelectTrigger className="h-9 w-full bg-background text-xs sm:w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All types</SelectItem>
            {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="col-span-2 h-9 rounded-md border border-dashed border-muted-foreground/30 text-xs text-muted-foreground hover:text-foreground sm:col-auto sm:h-auto sm:rounded-none sm:border-none"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Active filters & result count */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {isPending ? "Loading..." : `Showing ${posts.length} of ${totalCount} experiences`}
        </span>
        {/* Grid / List toggle — desktop & tablet only */}
        <div className="ml-auto hidden items-center rounded-lg border bg-muted/30 p-0.5 sm:flex">
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
        {outcomeFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">{OUTCOME_LABELS[outcomeFilter]}</Badge>
        )}
        {industryFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">{industryFilter}</Badge>
        )}
        {seniorityFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">{SENIORITY_LABELS[seniorityFilter]}</Badge>
        )}
        {typeFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">{INTERVIEW_TYPE_LABELS[typeFilter]}</Badge>
        )}
      </div>

      {/* Posts */}
      <div className={`grid gap-3 ${viewMode === "grid" ? "sm:grid-cols-2" : ""}`}>
        {isPending ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg border bg-muted/30" />
          ))
        ) : posts.length > 0 ? (
          posts.map((post, i) => (
            <ExperienceCard
              key={post.id}
              interview={post}
              companyName={post.companies?.name}
              companySlug={post.companies?.slug}
              companyLogoUrl={post.companies?.logo_url}
              isOpen={openIndex === i}
              onOpenChange={(open) => setOpenIndex(open ? i : null)}
              hasPrev={openIndex !== null && openIndex > 0}
              hasNext={openIndex !== null && openIndex < posts.length - 1}
              onPrev={() => setOpenIndex((openIndex ?? 0) - 1)}
              onNext={() => setOpenIndex((openIndex ?? 0) + 1)}
              positionLabel={openIndex !== null ? `${openIndex + 1} of ${posts.length}` : undefined}
            />
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-sm text-muted-foreground">
            No experiences match your filters. Try adjusting or clearing them.
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
