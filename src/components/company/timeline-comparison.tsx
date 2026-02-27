interface TimelineComparisonProps {
  companyAvgDays: number | null;
  industryAvgDays: number | null;
  industry: string;
}

export function TimelineComparison({
  companyAvgDays,
  industryAvgDays,
  industry,
}: TimelineComparisonProps) {
  if (!companyAvgDays || !industryAvgDays) return null;

  const maxDays = Math.max(companyAvgDays, industryAvgDays);
  const companyPct = Math.round((companyAvgDays / maxDays) * 100);
  const industryPct = Math.round((industryAvgDays / maxDays) * 100);

  const diff = companyAvgDays - industryAvgDays;
  const isFaster = diff < 0;
  const isSame = diff === 0;
  const absDiff = Math.abs(diff);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">Timeline Comparison</h3>
      <div className="space-y-3">
        {/* Company bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium">This company</span>
            <span className="font-semibold tabular-nums">
              {companyAvgDays} days
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${
                isFaster
                  ? "bg-emerald-500"
                  : isSame
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
              style={{ width: `${companyPct}%` }}
            />
          </div>
        </div>

        {/* Industry bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              {industry} avg
            </span>
            <span className="tabular-nums text-muted-foreground">
              {industryAvgDays} days
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted">
            <div
              className="h-2.5 rounded-full bg-muted-foreground/30 transition-all duration-700"
              style={{ width: `${industryPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <p
        className={`mt-3 text-xs font-medium ${
          isFaster
            ? "text-emerald-600"
            : isSame
              ? "text-muted-foreground"
              : "text-amber-600"
        }`}
      >
        {isSame
          ? `Same as the ${industry} average`
          : `${absDiff} day${absDiff !== 1 ? "s" : ""} ${
              isFaster ? "faster" : "slower"
            } than the ${industry} average`}
      </p>
    </div>
  );
}
