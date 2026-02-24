import { RATING_LABELS } from "@/lib/constants";

interface RatingsBreakdownProps {
  avgProfessionalism: number | null;
  avgCommunication: number | null;
  avgClarity: number | null;
  avgFairness: number | null;
}

function RatingBar({ label, value }: { label: string; value: number | null }) {
  const safeValue = value ?? 0;
  const percentage = (safeValue / 5) * 100;

  function getBarColor(v: number): string {
    if (v >= 4) return "bg-emerald-500";
    if (v >= 3) return "bg-amber-400";
    if (v >= 2) return "bg-orange-400";
    return "bg-red-400";
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(safeValue)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-medium">
        {value !== null ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}

export function RatingsBreakdown({
  avgProfessionalism,
  avgCommunication,
  avgClarity,
  avgFairness,
}: RatingsBreakdownProps) {
  const ratings = [
    { key: "communication_rating", value: avgCommunication },
    { key: "professionalism_rating", value: avgProfessionalism },
    { key: "clarity_rating", value: avgClarity },
    { key: "fairness_rating", value: avgFairness },
  ] as const;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Ratings Breakdown</h3>
      <div className="space-y-2.5">
        {ratings.map(({ key, value }) => (
          <RatingBar
            key={key}
            label={RATING_LABELS[key]}
            value={value}
          />
        ))}
      </div>
    </div>
  );
}
