import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { PlatformStats } from "@/components/home/platform-stats";
import { MissionSection } from "@/components/home/mission-section";
import { TrendingCompanies } from "@/components/home/trending-companies";
import { TopCompanies } from "@/components/home/top-companies";
import { WatchOutCompanies } from "@/components/home/watchout-companies";
import { RecentReviews } from "@/components/home/recent-reviews";
import { ClosingCTA } from "@/components/home/closing-cta";
import { CompanyEngageSection } from "@/components/home/company-engage-section";
import { GetInvolved } from "@/components/home/get-involved";
import { AdPlaceholder } from "@/components/shared/ad-placeholder";
import { CompanyPromo } from "@/components/shared/company-promo";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { buildHomepageJsonLd } from "@/lib/json-ld";

export const revalidate = 300;

function CompanySkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-6 h-7 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
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
        {Array.from({ length: 9 }, (_, i) => (
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
  const jsonLd = buildHomepageJsonLd();

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ScrollReveal />
      <HeroSection />
      <Suspense fallback={<StatsSkeleton />}>
        <PlatformStats />
      </Suspense>
      <div className="reveal">
        <MissionSection />
      </div>
      <div className="reveal">
        <Suspense fallback={<CompanySkeleton />}>
          <TrendingCompanies />
        </Suspense>
      </div>
      <div className="reveal">
        <Suspense fallback={<CompanySkeleton />}>
          <TopCompanies />
        </Suspense>
      </div>
      <div className="reveal">
        <Suspense fallback={<CompanySkeleton />}>
          <WatchOutCompanies />
        </Suspense>
      </div>
      <div className="reveal mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <CompanyPromo variant="homepage" />
      </div>
      <div className="reveal mx-auto max-w-6xl px-4 sm:px-6">
        <AdPlaceholder variant="leaderboard" />
      </div>
      <div className="reveal">
        <Suspense fallback={<ReviewsSkeleton />}>
          <RecentReviews />
        </Suspense>
      </div>
      <div className="reveal mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <AdPlaceholder variant="leaderboard" />
      </div>
      <div className="reveal">
        <ClosingCTA />
      </div>
      <div className="reveal">
        <CompanyEngageSection />
      </div>
      <div className="reveal">
        <GetInvolved />
      </div>
    </>
  );
}
