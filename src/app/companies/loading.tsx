import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>

      {/* Letter nav skeleton */}
      <div className="flex flex-wrap gap-1 border-b py-2">
        {Array.from({ length: 27 }, (_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded" />
        ))}
      </div>

      {/* Letter sections skeleton */}
      <div className="mt-6 space-y-10">
        {["A", "B", "C"].map((letter) => (
          <div key={letter}>
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
