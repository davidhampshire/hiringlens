"use client";

import { useState, useMemo } from "react";
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
import { createClient } from "@/lib/supabase/client";
import {
  OUTCOME_LABELS,
  INDUSTRIES,
  SENIORITY_LABELS,
  INTERVIEW_TYPE_LABELS,
} from "@/lib/constants";
import type { Interview } from "@/types";

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string; industry: string | null } | null;
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
  totalCount,
}: RecentPostsListProps) {
  const [posts, setPosts] = useState<InterviewWithCompany[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

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

  const displayedPosts = useMemo(() => {
    let filtered = [...posts];

    if (outcomeFilter !== "all") {
      filtered = filtered.filter((p) => p.outcome === outcomeFilter);
    }
    if (industryFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.companies?.industry === industryFilter
      );
    }
    if (seniorityFilter !== "all") {
      filtered = filtered.filter((p) => p.seniority === seniorityFilter);
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.interview_type === typeFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        case "highest": {
          const avgA =
            (a.professionalism_rating +
              a.communication_rating +
              a.clarity_rating +
              a.fairness_rating) /
            4;
          const avgB =
            (b.professionalism_rating +
              b.communication_rating +
              b.clarity_rating +
              b.fairness_rating) /
            4;
          return avgB - avgA;
        }
        case "lowest": {
          const avgA2 =
            (a.professionalism_rating +
              a.communication_rating +
              a.clarity_rating +
              a.fairness_rating) /
            4;
          const avgB2 =
            (b.professionalism_rating +
              b.communication_rating +
              b.clarity_rating +
              b.fairness_rating) /
            4;
          return avgA2 - avgB2;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, sortBy, outcomeFilter, industryFilter, seniorityFilter, typeFilter]);

  function clearFilters() {
    setOutcomeFilter("all");
    setIndustryFilter("all");
    setSeniorityFilter("all");
    setTypeFilter("all");
  }

  async function loadMore() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("interviews")
        .select("*, companies(name, slug, industry)")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .range(posts.length, posts.length + PAGE_SIZE - 1);

      if (data) {
        setPosts((prev) => [
          ...prev,
          ...(data as unknown as InterviewWithCompany[]),
        ]);
      }
    } catch {
      // Silently handle - user can retry
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger className="h-8 w-[140px] text-xs">
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

        <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Outcome" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All outcomes
            </SelectItem>
            {Object.entries(OUTCOME_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All industries
            </SelectItem>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry} className="text-xs">
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Seniority" />
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

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Type" />
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
          Showing {displayedPosts.length} of {totalCount} experiences
        </span>
        {outcomeFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {OUTCOME_LABELS[outcomeFilter]}
          </Badge>
        )}
        {industryFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {industryFilter}
          </Badge>
        )}
        {seniorityFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {SENIORITY_LABELS[seniorityFilter]}
          </Badge>
        )}
        {typeFilter !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {INTERVIEW_TYPE_LABELS[typeFilter]}
          </Badge>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <ExperienceCard
              key={post.id}
              interview={post}
              companyName={post.companies?.name}
              companySlug={post.companies?.slug}
            />
          ))
        ) : (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No experiences match your filters. Try adjusting or clearing them.
          </div>
        )}
      </div>

      {/* Load more */}
      {hasMore && activeFilterCount === 0 && (
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
