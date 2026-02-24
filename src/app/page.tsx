import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { PlatformStats } from "@/components/home/platform-stats";
import { TrendingCompanies } from "@/components/home/trending-companies";
import { RecentReviews } from "@/components/home/recent-reviews";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 300;

function CompanySkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-6 h-7 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </section>
  );
}

function ReviewsSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-6 h-7 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    </section>
  );
}

function StatsSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Skeleton className="h-24 rounded-xl" />
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<StatsSkeleton />}>
        <PlatformStats />
      </Suspense>
      <Suspense fallback={<CompanySkeleton />}>
        <TrendingCompanies />
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <RecentReviews />
      </Suspense>
    </>
  );
}
