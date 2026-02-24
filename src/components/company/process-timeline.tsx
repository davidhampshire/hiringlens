interface ProcessTimelineProps {
  avgStages: number | null;
  avgDurationDays: number | null;
  totalReviews: number;
}

export function ProcessTimeline({
  avgStages,
  avgDurationDays,
  totalReviews,
}: ProcessTimelineProps) {
  if (totalReviews === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Typical Process</h3>
      <div className="flex gap-4">
        {avgStages && (
          <div className="flex-1 rounded-lg border bg-muted/30 p-4 text-center">
            <p className="text-2xl font-bold">{Math.round(avgStages)}</p>
            <p className="text-xs text-muted-foreground">stages</p>
          </div>
        )}
        {avgDurationDays && (
          <div className="flex-1 rounded-lg border bg-muted/30 p-4 text-center">
            <p className="text-2xl font-bold">{Math.round(avgDurationDays)}</p>
            <p className="text-xs text-muted-foreground">days total</p>
          </div>
        )}
      </div>

      {/* Visual timeline */}
      {avgStages && (
        <div className="flex items-center gap-1 pt-1">
          {Array.from({ length: Math.min(Math.round(avgStages), 10) }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {i + 1}
              </div>
              {i < Math.min(Math.round(avgStages), 10) - 1 && (
                <div className="h-0.5 w-4 bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
