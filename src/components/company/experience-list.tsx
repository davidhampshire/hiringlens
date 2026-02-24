"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExperienceCard } from "./experience-card";
import { createClient } from "@/lib/supabase/client";
import type { Interview } from "@/types";

interface ExperienceListProps {
  companyId: string;
  initialInterviews: Interview[];
  totalCount: number;
}

const PAGE_SIZE = 10;

export function ExperienceList({
  companyId,
  initialInterviews,
  totalCount,
}: ExperienceListProps) {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = interviews.length < totalCount;

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
      <h3 className="text-sm font-semibold">
        Interview Experiences ({totalCount})
      </h3>
      <div className="space-y-3">
        {interviews.map((interview) => (
          <ExperienceCard key={interview.id} interview={interview} />
        ))}
      </div>
      {hasMore && (
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
