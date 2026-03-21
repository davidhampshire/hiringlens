"use client";

/**
 * AdUnit — smart ad slot component.
 *
 * Rendering priority:
 *   1. Real Google AdSense ad  (when NEXT_PUBLIC_ADSENSE_CLIENT_ID + slot env vars are set)
 *   2. Placeholder dashed box  (dev / before AdSense approval / direct-sales preview)
 *
 * Environment variables needed for live ads:
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID          — your publisher ID, e.g. ca-pub-1234567890123456
 *   NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD   — slot ID for 728×90 leaderboard units
 *   NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR       — slot ID for 300×250 sidebar units
 *   NEXT_PUBLIC_ADSENSE_SLOT_BANNER        — slot ID for 728×250 banner units (optional)
 *
 * When those vars are absent the component renders the dashed placeholder so potential
 * advertisers (e.g. recruitment companies) can see exactly where ads will appear.
 */

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AdPlaceholder } from "./ad-placeholder";

export type AdVariant = "leaderboard" | "banner" | "sidebar";

interface AdUnitProps {
  variant?: AdVariant;
  className?: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const SLOT_IDS: Record<AdVariant, string | undefined> = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD,
  banner:      process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
  sidebar:     process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
};

// Min dimensions so AdSense can choose the right creative size
const MIN_HEIGHT: Record<AdVariant, string> = {
  leaderboard: "h-[90px]",
  banner:      "h-[250px]",
  sidebar:     "h-[250px]",
};

type AdsWindow = Window & { adsbygoogle?: object[] };

export function AdUnit({ variant = "leaderboard", className }: AdUnitProps) {
  const slot    = SLOT_IDS[variant];
  const pushed  = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || !slot || pushed.current) return;
    pushed.current = true;
    try {
      ((window as AdsWindow).adsbygoogle =
        (window as AdsWindow).adsbygoogle ?? []).push({});
    } catch {
      // adsbygoogle not yet initialised — will be picked up by AdSense on next tick
    }
  }, [slot]);

  // No credentials → show placeholder (still useful: advertisers see the slots)
  if (!CLIENT_ID || !slot) {
    return <AdPlaceholder variant={variant} className={className} />;
  }

  return (
    <div className={cn("overflow-hidden", MIN_HEIGHT[variant], className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
