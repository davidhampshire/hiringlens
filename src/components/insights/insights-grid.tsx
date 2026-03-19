"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface IndustryStats {
  industry: string;
  companies: number;
  totalReviews: number;
  avgStages: number | null;
  avgDuration: number | null;
  avgScore: number | null;
  ghostingRate: number | null;
  feedbackRate: number | null;
  unpaidTaskRate: number | null;
}

type SortKey = "reviews" | "highest" | "lowest" | "companies" | "az";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "reviews", label: "Most Reviews" },
  { key: "highest", label: "Highest Rated" },
  { key: "lowest", label: "Lowest Rated" },
  { key: "companies", label: "Most Companies" },
  { key: "az", label: "A–Z" },
];

function AnimatedBar({
  value,
  max = 100,
  color,
  delay = 0,
}: {
  value: number;
  max?: number;
  color: string;
  delay?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{
          width: `${width}%`,
          transition: "width 0.8s ease-out",
        }}
      />
    </div>
  );
}

function StatRow({
  label,
  value,
  suffix = "",
  barValue,
  barMax = 100,
  barColor = "bg-primary",
  barDelay = 0,
}: {
  label: string;
  value: string;
  suffix?: string;
  barValue?: number;
  barMax?: number;
  barColor?: string;
  barDelay?: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}
          {suffix}
        </span>
      </div>
      {barValue !== undefined && (
        <AnimatedBar value={barValue} max={barMax} color={barColor} delay={barDelay} />
      )}
    </div>
  );
}

export function InsightsGrid({ industries }: { industries: IndustryStats[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("reviews");

  const sorted = useMemo(() => {
    const copy = [...industries];
    switch (sortKey) {
      case "reviews":
        return copy.sort((a, b) => b.totalReviews - a.totalReviews);
      case "highest":
        return copy.sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0));
      case "lowest":
        return copy.sort((a, b) => (a.avgScore ?? 0) - (b.avgScore ?? 0));
      case "companies":
        return copy.sort((a, b) => b.companies - a.companies);
      case "az":
        return copy.sort((a, b) => a.industry.localeCompare(b.industry));
      default:
        return copy;
    }
  }, [industries, sortKey]);

  return (
    <>
      {/* Sort controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SORT_OPTIONS.map((opt) => (
          <Button
            key={opt.key}
            variant={sortKey === opt.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSortKey(opt.key)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((ind) => (
          <Link
            key={ind.industry}
            href={`/search?industry=${encodeURIComponent(ind.industry)}`}
          >
            <Card className="gap-0 p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 cursor-pointer h-full">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{ind.industry}</h3>
                  {ind.avgScore != null && (
                    <Badge
                      className={
                        ind.avgScore >= 75
                          ? "bg-emerald-100 text-emerald-700"
                          : ind.avgScore >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }
                    >
                      {Math.round(ind.avgScore)}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ind.companies} {ind.companies === 1 ? "company" : "companies"} &middot;{" "}
                  {ind.totalReviews} {ind.totalReviews === 1 ? "review" : "reviews"}
                </p>

                <div className="mt-4 space-y-3">
                  {ind.avgStages != null && (
                    <StatRow
                      label="Avg stages"
                      value={ind.avgStages.toFixed(1)}
                      barValue={ind.avgStages}
                      barMax={10}
                      barColor="bg-blue-500"
                      barDelay={0}
                    />
                  )}
                  {ind.avgDuration != null && (
                    <StatRow
                      label="Avg duration"
                      value={`${Math.round(ind.avgDuration)}`}
                      suffix=" days"
                      barValue={ind.avgDuration}
                      barMax={60}
                      barColor="bg-violet-500"
                      barDelay={50}
                    />
                  )}
                  {ind.ghostingRate != null && (
                    <StatRow
                      label="Ghosting rate"
                      value={`${Math.round(ind.ghostingRate)}`}
                      suffix="%"
                      barValue={ind.ghostingRate}
                      barColor="bg-rose-500"
                      barDelay={100}
                    />
                  )}
                  {ind.feedbackRate != null && (
                    <StatRow
                      label="Feedback rate"
                      value={`${Math.round(ind.feedbackRate)}`}
                      suffix="%"
                      barValue={ind.feedbackRate}
                      barColor="bg-emerald-500"
                      barDelay={150}
                    />
                  )}
                  {ind.unpaidTaskRate != null && (
                    <StatRow
                      label="Unpaid task rate"
                      value={`${Math.round(ind.unpaidTaskRate)}`}
                      suffix="%"
                      barValue={ind.unpaidTaskRate}
                      barColor="bg-amber-500"
                      barDelay={200}
                    />
                  )}
                </div>

                <p className="mt-4 text-xs font-medium text-muted-foreground/70">
                  View companies &rarr;
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
