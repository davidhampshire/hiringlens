"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardReviewCard } from "@/components/company-dashboard/dashboard-review-card";
import type { Interview, CompanyResponse } from "@/types";

interface CompanyDashboardProps {
  company: {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    logo_url: string | null;
  };
  representative: {
    id: string;
    email: string;
    role: "admin" | "responder";
  };
  interviews: Interview[];
  responseMap: Record<string, CompanyResponse>;
  stats: {
    totalReviews: number;
    totalResponses: number;
    pendingResponses: number;
    publishedResponses: number;
  };
}

export function CompanyDashboard({
  company,
  representative,
  interviews,
  responseMap,
  stats,
}: CompanyDashboardProps) {
  return (
    <div>
      {/* Header */}
      <div className="animate-in-view mb-8">
        <div className="flex items-center gap-3">
          {company.logo_url && (
            <img
              src={company.logo_url}
              alt=""
              className="h-10 w-10 rounded-lg object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-sm text-muted-foreground">
              {company.industry ?? "Company"} &middot; {representative.email}
              <Badge className="ml-2 bg-emerald-100 text-emerald-700">
                Verified Rep
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-in-view-d1 mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="gap-0 p-4 text-center">
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
          <p className="text-xs text-muted-foreground">Reviews</p>
        </Card>
        <Card className="gap-0 p-4 text-center">
          <p className="text-2xl font-bold">{stats.totalResponses}</p>
          <p className="text-xs text-muted-foreground">Responses</p>
        </Card>
        <Card className="gap-0 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {stats.pendingResponses}
          </p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </Card>
        <Card className="gap-0 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {stats.publishedResponses}
          </p>
          <p className="text-xs text-muted-foreground">Published</p>
        </Card>
      </div>

      {/* Reviews */}
      <div className="animate-in-view-d2">
        <h2 className="mb-4 text-lg font-semibold">
          Candidate Reviews
          {interviews.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({interviews.length})
            </span>
          )}
        </h2>

        {interviews.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="font-semibold">No reviews yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              When candidates submit approved reviews about {company.name},
              they&apos;ll appear here for you to respond to.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <DashboardReviewCard
                key={interview.id}
                interview={interview}
                response={responseMap[interview.id] ?? null}
                representativeId={representative.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
