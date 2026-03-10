import { cn } from "@/lib/utils";
import { RATING_LABELS } from "@/lib/constants";

interface RatingsBreakdownProps {
  avgProfessionalism: number | null;
  avgCommunication: number | null;
  avgClarity: number | null;
  avgFairness: number | null;
  compact?: boolean;
}

function RatingBar({
  label,
  value,
  compact,
}: {
  label: string;
  value: number | null;
  compact?: boolean;
}) {
  const safeValue = value ?? 0;
  const percentage = (safeValue / 5) * 100;

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
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(safeValue)}`}
          style={{ width: `${percentage}%` }}
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
}: RatingsBreakdownProps) {
  const ratings = [
    { key: "communication_rating", value: avgCommunication },
    { key: "professionalism_rating", value: avgProfessionalism },
    { key: "clarity_rating", value: avgClarity },
    { key: "fairness_rating", value: avgFairness },
  ] as const;

  return (
    <div className={cn("space-y-2", compact ? "space-y-1.5" : "space-y-3")}>
      {!compact && <h3 className="text-sm font-semibold">Ratings Breakdown</h3>}
      <div className={cn(compact ? "space-y-1.5" : "space-y-2.5")}>
        {ratings.map(({ key, value }) => (
          <RatingBar
            key={key}
            label={RATING_LABELS[key]}
            value={value}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
