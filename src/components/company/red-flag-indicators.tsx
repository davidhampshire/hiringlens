import { Badge } from "@/components/ui/badge";

interface RedFlagIndicatorsProps {
  pctGhosted: number | null;
  pctUnpaidTask: number | null;
  pctExceededTimeline: number | null;
  pctNoFeedback: number | null;
  totalReviews: number;
}

interface FlagItem {
  label: string;
  pct: number;
  type: "negative" | "warning";
}

export function RedFlagIndicators({
  pctGhosted,
  pctUnpaidTask,
  pctExceededTimeline,
  pctNoFeedback,
  totalReviews,
}: RedFlagIndicatorsProps) {
  if (totalReviews === 0) return null;

  const allFlags: FlagItem[] = [
    { label: "Ghosted", pct: (pctGhosted ?? 0) * 100, type: "negative" },
    { label: "Unpaid work", pct: (pctUnpaidTask ?? 0) * 100, type: "negative" },
    { label: "Exceeded timeline", pct: (pctExceededTimeline ?? 0) * 100, type: "warning" },
    { label: "No feedback", pct: (pctNoFeedback ?? 0) * 100, type: "warning" },
  ];
  const flags = allFlags.filter((f) => f.pct > 10);

  if (flags.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Red Flags</h3>
      <div className="flex flex-wrap gap-2">
        {flags.map((flag) => (
          <Badge
            key={flag.label}
            variant={flag.type === "negative" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {flag.label}: {Math.round(flag.pct)}% report
          </Badge>
        ))}
      </div>
    </div>
  );
}
