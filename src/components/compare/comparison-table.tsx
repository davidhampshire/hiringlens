"use client";

import Link from "next/link";
import { CompanyLogo } from "@/components/shared/company-logo";
import type { CompanyScore } from "@/types";

interface ComparisonTableProps {
  companies: CompanyScore[];
}

interface MetricRow {
  label: string;
  getValue: (c: CompanyScore) => string | number | null;
  format?: (v: number | null) => string;
  higherIsBetter?: boolean;
  isPercentage?: boolean;
}

function formatScore(v: number | null): string {
  if (v === null) return "—";
  return Math.round(v).toString();
}

function formatRating(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(1);
}

function formatPct(v: number | null): string {
  if (v === null) return "—";
  return `${Math.round(v)}%`;
}

function formatDays(v: number | null): string {
  if (v === null) return "—";
  return `${Math.round(v)} days`;
}

function formatStages(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(1);
}

const METRICS: MetricRow[] = [
  {
    label: "Reality Score",
    getValue: (c) => c.reality_score,
    format: formatScore,
    higherIsBetter: true,
  },
  {
    label: "Professionalism",
    getValue: (c) => c.avg_professionalism,
    format: formatRating,
    higherIsBetter: true,
  },
  {
    label: "Communication",
    getValue: (c) => c.avg_communication,
    format: formatRating,
    higherIsBetter: true,
  },
  {
    label: "Clarity",
    getValue: (c) => c.avg_clarity,
    format: formatRating,
    higherIsBetter: true,
  },
  {
    label: "Fairness",
    getValue: (c) => c.avg_fairness,
    format: formatRating,
    higherIsBetter: true,
  },
  {
    label: "Ghosted",
    getValue: (c) => c.pct_ghosted,
    format: formatPct,
    higherIsBetter: false,
    isPercentage: true,
  },
  {
    label: "Unpaid Tasks",
    getValue: (c) => c.pct_unpaid_task,
    format: formatPct,
    higherIsBetter: false,
    isPercentage: true,
  },
  {
    label: "Exceeded Timeline",
    getValue: (c) => c.pct_exceeded_timeline,
    format: formatPct,
    higherIsBetter: false,
    isPercentage: true,
  },
  {
    label: "No Feedback",
    getValue: (c) => c.pct_no_feedback,
    format: formatPct,
    higherIsBetter: false,
    isPercentage: true,
  },
  {
    label: "Avg. Stages",
    getValue: (c) => c.avg_stages,
    format: formatStages,
    higherIsBetter: false,
  },
  {
    label: "Avg. Duration",
    getValue: (c) => c.avg_duration_days,
    format: formatDays,
    higherIsBetter: false,
  },
  {
    label: "Total Reviews",
    getValue: (c) => c.total_reviews,
    format: (v) => (v === null ? "—" : v.toString()),
    higherIsBetter: true,
  },
];

function getBestIndex(
  values: (number | null)[],
  higherIsBetter: boolean
): number | null {
  const validIndices = values
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v !== null);

  if (validIndices.length < 2) return null;

  const best = validIndices.reduce((a, b) => {
    if (a.v === null) return b;
    if (b.v === null) return a;
    return higherIsBetter ? (b.v! > a.v! ? b : a) : (b.v! < a.v! ? b : a);
  });

  return best.i;
}

export function ComparisonTable({ companies }: ComparisonTableProps) {
  if (companies.length < 2) {
    return (
      <div className="rounded-lg border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
        Select at least 2 companies to compare
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Company headers */}
        <thead>
          <tr>
            <th className="w-[160px] border-b p-3 text-left text-xs font-medium text-muted-foreground">
              Metric
            </th>
            {companies.map((c) => (
              <th key={c.company_id} className="border-b p-3 text-center">
                <Link href={`/company/${c.slug}`} className="group inline-flex flex-col items-center gap-1.5">
                  <CompanyLogo name={c.name} logoUrl={c.logo_url} size="sm" />
                  <span className="text-sm font-semibold group-hover:text-primary group-hover:underline">
                    {c.name}
                  </span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {METRICS.map((metric) => {
            const values = companies.map((c) => {
              const raw = metric.getValue(c);
              return typeof raw === "number" ? raw : null;
            });
            const bestIdx = getBestIndex(
              values,
              metric.higherIsBetter ?? true
            );

            return (
              <tr key={metric.label} className="border-b last:border-0">
                <td className="p-3 text-sm font-medium">{metric.label}</td>
                {companies.map((c, i) => {
                  const raw = metric.getValue(c);
                  const numVal = typeof raw === "number" ? raw : null;
                  const formatted = metric.format
                    ? metric.format(numVal)
                    : (numVal?.toString() ?? "—");
                  const isBest = bestIdx === i;

                  return (
                    <td
                      key={c.company_id}
                      className={`p-3 text-center text-sm ${
                        isBest
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : ""
                      }`}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
