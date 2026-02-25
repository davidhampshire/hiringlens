"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminInterviewRow } from "@/components/admin/admin-interview-row";
import { EmptyState } from "@/components/shared/empty-state";
import type { Interview } from "@/types";

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string } | null;
};

type InterviewWithFlags = InterviewWithCompany & {
  flag_count: number;
};

interface AdminTabsProps {
  pendingInterviews: InterviewWithCompany[];
  flaggedInterviews: InterviewWithFlags[];
}

type Tab = "pending" | "flagged";

export function AdminTabs({
  pendingInterviews,
  flaggedInterviews,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: pendingInterviews.length },
    { id: "flagged", label: "Flagged", count: flaggedInterviews.length },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-6 flex gap-1 rounded-lg border bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={cn(
                  "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                  activeTab === tab.id
                    ? tab.id === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingInterviews.length === 0 ? (
            <EmptyState
              title="No pending reviews"
              description="All submitted reviews have been moderated. Check back later."
            />
          ) : (
            pendingInterviews.map((interview) => (
              <AdminInterviewRow
                key={interview.id}
                interview={interview}
                showActions
              />
            ))
          )}
        </div>
      )}

      {activeTab === "flagged" && (
        <div className="space-y-4">
          {flaggedInterviews.length === 0 ? (
            <EmptyState
              title="No flagged reviews"
              description="No approved reviews have been flagged by users."
            />
          ) : (
            flaggedInterviews.map((interview) => (
              <AdminInterviewRow
                key={interview.id}
                interview={interview}
                flagCount={interview.flag_count}
                showActions
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
