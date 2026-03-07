"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminInterviewRow } from "@/components/admin/admin-interview-row";
import { EmptyState } from "@/components/shared/empty-state";
import { bulkApproveInterviews, bulkRejectInterviews } from "@/lib/actions/admin";
import { toast } from "sonner";
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

function matchesSearch(interview: InterviewWithCompany, query: string): boolean {
  const q = query.toLowerCase();
  return (
    (interview.companies?.name ?? "").toLowerCase().includes(q) ||
    interview.role_title.toLowerCase().includes(q) ||
    (interview.overall_comments ?? "").toLowerCase().includes(q) ||
    (interview.candidate_tip ?? "").toLowerCase().includes(q) ||
    (interview.location ?? "").toLowerCase().includes(q)
  );
}

export function AdminTabs({
  pendingInterviews,
  flaggedInterviews,
  contactMessages,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const filteredPending = useMemo(
    () =>
      searchQuery.trim()
        ? pendingInterviews.filter((i) => matchesSearch(i, searchQuery))
        : pendingInterviews,
    [pendingInterviews, searchQuery]
  );

  const filteredFlagged = useMemo(
    () =>
      searchQuery.trim()
        ? flaggedInterviews.filter((i) => matchesSearch(i, searchQuery))
        : flaggedInterviews,
    [flaggedInterviews, searchQuery]
  );

  const filteredMessages = useMemo(
    () =>
      searchQuery.trim()
        ? contactMessages.filter((m) => {
            const q = searchQuery.toLowerCase();
            return (
              m.name.toLowerCase().includes(q) ||
              m.email.toLowerCase().includes(q) ||
              m.subject.toLowerCase().includes(q) ||
              m.message.toLowerCase().includes(q)
            );
          })
        : contactMessages,
    [contactMessages, searchQuery]
  );

  const currentList =
    activeTab === "pending"
      ? filteredPending
      : activeTab === "flagged"
        ? filteredFlagged
        : [];

  const allSelected =
    currentList.length > 0 && currentList.every((i) => selectedIds.has(i.id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentList.map((i) => i.id)));
    }
  }

  async function handleBulkApprove() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkLoading(true);
    try {
      const result = await bulkApproveInterviews(ids);
      toast.success(`Approved ${result.count} interviews`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Bulk approve failed");
    } finally {
      setBulkLoading(false);
    }
  }

  async function handleBulkReject() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkLoading(true);
    try {
      const result = await bulkRejectInterviews(ids);
      toast.success(`Rejected ${result.count} interviews`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Bulk reject failed");
    } finally {
      setBulkLoading(false);
    }
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: pendingInterviews.length },
    { id: "flagged", label: "Flagged", count: flaggedInterviews.length },
    { id: "messages", label: "Messages", count: contactMessages.length },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-4 flex gap-1 rounded-lg border bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedIds(new Set());
            }}
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

      {/* Search */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by company, role, location, or comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Bulk actions bar */}
      {(activeTab === "pending" || activeTab === "flagged") && currentList.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all"
            />
            <span className="text-xs text-muted-foreground">
              {selectedIds.size > 0
                ? `${selectedIds.size} selected`
                : "Select all"}
            </span>
          </div>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleBulkApprove}
                disabled={bulkLoading}
              >
                Approve {selectedIds.size}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkReject}
                disabled={bulkLoading}
              >
                Reject {selectedIds.size}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {filteredPending.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No matches" : "No pending reviews"}
              description={
                searchQuery
                  ? "Try a different search term."
                  : "All submitted reviews have been moderated. Check back later."
              }
            />
          ) : (
            filteredPending.map((interview) => (
              <div key={interview.id} className="flex gap-3">
                <div className="flex shrink-0 items-start pt-5">
                  <Checkbox
                    checked={selectedIds.has(interview.id)}
                    onCheckedChange={() => toggleSelect(interview.id)}
                    aria-label={`Select ${interview.role_title} at ${interview.companies?.name}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <AdminInterviewRow
                    interview={interview}
                    showActions
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "flagged" && (
        <div className="space-y-4">
          {filteredFlagged.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No matches" : "No flagged reviews"}
              description={
                searchQuery
                  ? "Try a different search term."
                  : "No approved reviews have been flagged by users."
              }
            />
          ) : (
            filteredFlagged.map((interview) => (
              <div key={interview.id} className="flex gap-3">
                <div className="flex shrink-0 items-start pt-5">
                  <Checkbox
                    checked={selectedIds.has(interview.id)}
                    onCheckedChange={() => toggleSelect(interview.id)}
                    aria-label={`Select ${interview.role_title} at ${interview.companies?.name}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <AdminInterviewRow
                    interview={interview}
                    flagCount={interview.flag_count}
                    showActions
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No matches" : "No messages"}
              description={
                searchQuery
                  ? "Try a different search term."
                  : "No contact messages have been submitted yet."
              }
            />
          ) : (
            filteredMessages.map((msg) => (
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
