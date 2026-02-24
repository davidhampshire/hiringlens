"use client";

import { cn, formatScore, getScoreColor } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RealityScoreBadgeProps {
  score: number | null;
  totalReviews: number;
}

export function RealityScoreBadge({ score, totalReviews }: RealityScoreBadgeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (score === null) return;
    const target = Math.round(score);
    const duration = 800;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset =
    score !== null
      ? circumference - (animatedScore / 100) * circumference
      : circumference;

  function getStrokeColor(s: number | null): string {
    if (s === null) return "#d4d4d8";
    if (s >= 70) return "#10b981";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", getScoreColor(score))}>
            {score !== null ? formatScore(score) : "N/A"}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Reality Score</p>
        <p className="text-xs text-muted-foreground">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>
    </div>
  );
}
