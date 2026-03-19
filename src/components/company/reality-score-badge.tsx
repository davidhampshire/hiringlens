"use client";

import { cn, formatScore, getScoreColor } from "@/lib/utils";
import { useEffect, useState } from "react";
import { InfoTooltip } from "@/components/ui/tooltip";

interface RealityScoreBadgeProps {
  score: number | null;
  totalReviews: number;
  size?: "default" | "sm";
}

export function RealityScoreBadge({
  score,
  totalReviews,
  size = "default",
}: RealityScoreBadgeProps) {
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

  const isSmall = size === "sm";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn("relative", isSmall ? "h-20 w-20" : "h-32 w-32")}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth={isSmall ? 10 : 8}
            className="text-muted/30"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth={isSmall ? 10 : 8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-bold leading-none",
              isSmall ? "text-xl" : "text-3xl",
              getScoreColor(score)
            )}
          >
            {score !== null ? formatScore(score) : "N/A"}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <p className={cn("font-medium", isSmall ? "text-xs" : "text-sm")}>
            Reality Score
          </p>
          {!isSmall && (
            <InfoTooltip content="A score from 0–100 based on four rating dimensions (professionalism, communication, clarity, fairness), with automatic penalties for red flags like ghosting (−15%), unpaid tasks (−10%), exceeded timelines (−10%), and no feedback (−5%)." />
          )}
        </div>
        {!isSmall && (
          <p className="text-xs text-muted-foreground">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        )}
      </div>
    </div>
  );
}
