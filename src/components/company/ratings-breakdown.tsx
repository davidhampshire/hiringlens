"use client";

import { cn } from "@/lib/utils";
import { RATING_LABELS } from "@/lib/constants";
import { useEffect, useState } from "react";

interface RatingsBreakdownProps {
  avgProfessionalism: number | null;
  avgCommunication: number | null;
  avgClarity: number | null;
  avgFairness: number | null;
  compact?: boolean;
  animate?: boolean;
}

function RatingBar({
  label,
  value,
  compact,
  animate,
  delay,
}: {
  label: string;
  value: number | null;
  compact?: boolean;
  animate?: boolean;
  delay: number;
}) {
  const safeValue = value ?? 0;
  const percentage = (safeValue / 5) * 100;
  const [width, setWidth] = useState(animate ? 0 : percentage);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setWidth(percentage), delay);
    return () => clearTimeout(timer);
  }, [animate, percentage, delay]);

  function getBarColor(v: number): string {
    if (v >= 4) return "bg-emerald-500";
    if (v >= 3) return "bg-amber-400";
    if (v >= 2) return "bg-orange-400";
    return "bg-red-400";
  }

  return (
    <div className={cn("flex items-center gap-2", compact ? "gap-2" : "gap-3")}>
      <span
        className={cn(
          "shrink-0 text-muted-foreground",
          compact ? "w-24 text-xs" : "w-32 text-sm"
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-muted",
          compact ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full",
            getBarColor(safeValue),
            animate
              ? "transition-[width] duration-700 ease-out"
              : "transition-all duration-500"
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={cn(
          "w-7 text-right font-medium",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {value !== null ? value.toFixed(1) : "-"}
      </span>
    </div>
  );
}

export function RatingsBreakdown({
  avgProfessionalism,
  avgCommunication,
  avgClarity,
  avgFairness,
  compact = false,
  animate = false,
}: RatingsBreakdownProps) {
  const ratings = [
    { key: "communication_rating", value: avgCommunication },
    { key: "professionalism_rating", value: avgProfessionalism },
    { key: "clarity_rating", value: avgClarity },
    { key: "fairness_rating", value: avgFairness },
  ] as const;

  return (
    <div className={cn("space-y-2", compact ? "space-y-1.5" : "space-y-3")}>
      {!compact && <h3 className="text-base font-medium">Ratings Breakdown</h3>}
      <div className={cn(compact ? "space-y-1.5" : "space-y-2.5")}>
        {ratings.map(({ key, value }, index) => (
          <RatingBar
            key={key}
            label={RATING_LABELS[key]}
            value={value}
            compact={compact}
            animate={animate}
            delay={150 + index * 100}
          />
        ))}
      </div>
    </div>
  );
}
