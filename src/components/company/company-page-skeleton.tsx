import { Skeleton } from "@/components/ui/skeleton";

export function ExperienceListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter bar skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-[140px] rounded-md" />
          <Skeleton className="h-8 w-[130px] rounded-md" />
          <Skeleton className="h-8 w-[130px] rounded-md" />
          <Skeleton className="h-8 w-[130px] rounded-md" />
        </div>
      </div>

      {/* Card skeletons */}
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-lg border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
