"use client";

import { useState, useTransition } from "react";
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
  const [posts, setPosts] = useState<InterviewWithCompany[]>(initialPosts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [seniorityFilter, setSeniorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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
    refetch(newSort, newOutcome, newIndustry, newSeniority, newType);
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
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={sortBy}
          onValueChange={(v) =>
            updateFilter(v as SortOption, outcomeFilter, industryFilter, seniorityFilter, typeFilter)
          }
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
          value={outcomeFilter}
          onValueChange={(v) =>
            updateFilter(sortBy, v, industryFilter, seniorityFilter, typeFilter)
          }
        >
          <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
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
          <SelectTrigger className="h-9 w-[150px] bg-white text-xs">
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
          <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
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
          <SelectTrigger className="h-9 w-[130px] bg-white text-xs">
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
            className="text-xs text-muted-foreground hover:text-foreground"
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
      <div className="grid gap-3 sm:grid-cols-2">
        {isPending ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg border bg-muted/30" />
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <ExperienceCard
              key={post.id}
              interview={post}
              companyName={post.companies?.name}
              companySlug={post.companies?.slug}
              companyLogoUrl={post.companies?.logo_url}
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
