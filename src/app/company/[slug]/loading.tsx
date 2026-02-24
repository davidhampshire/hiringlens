import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function CompanyLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar skeleton */}
        <aside className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Separator />

          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>

          <Separator />

          <div className="flex gap-4">
            <Skeleton className="h-20 flex-1 rounded-lg" />
            <Skeleton className="h-20 flex-1 rounded-lg" />
          </div>
        </aside>

        {/* Main content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
