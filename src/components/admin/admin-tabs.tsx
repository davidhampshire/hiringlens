"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminInterviewRow } from "@/components/admin/admin-interview-row";
import { EmptyState } from "@/components/shared/empty-state";
import type { Interview } from "@/types";

type InterviewWithCompany = Interview & {
  companies: { name: string; slug: string } | null;
};

type InterviewWithFlags = InterviewWithCompany & {
  flag_count: number;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

interface AdminTabsProps {
  pendingInterviews: InterviewWithCompany[];
  flaggedInterviews: InterviewWithFlags[];
  contactMessages: ContactMessage[];
}

type Tab = "pending" | "flagged" | "messages";

const TAB_BADGE_COLORS: Record<Tab, string> = {
  pending: "bg-amber-100 text-amber-700",
  flagged: "bg-rose-100 text-rose-700",
  messages: "bg-blue-100 text-blue-700",
};

export function AdminTabs({
  pendingInterviews,
  flaggedInterviews,
  contactMessages,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: pendingInterviews.length },
    { id: "flagged", label: "Flagged", count: flaggedInterviews.length },
    { id: "messages", label: "Messages", count: contactMessages.length },
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
                    ? TAB_BADGE_COLORS[tab.id]
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

      {activeTab === "messages" && (
        <div className="space-y-4">
          {contactMessages.length === 0 ? (
            <EmptyState
              title="No messages"
              description="No contact messages have been submitted yet."
            />
          ) : (
            contactMessages.map((msg) => (
              <Card key={msg.id} className="gap-0 p-0">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{msg.subject}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {msg.name} &middot;{" "}
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-primary hover:underline"
                        >
                          {msg.email}
                        </a>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {msg.message}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
