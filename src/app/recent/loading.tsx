import { Skeleton } from "@/components/ui/skeleton";

export default function RecentLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-md" />
        ))}
      </div>

      {/* Result count skeleton */}
      <Skeleton className="mb-4 h-4 w-48" />

      {/* Card skeletons */}
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
