"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function AnalyticsWrapper() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    function readConsent() {
      const match = document.cookie.match(
        /(?:^|; )cookie_consent=([^;]*)/
      );
      return match ? decodeURIComponent(match[1]) : null;
    }

    setConsent(readConsent());

    // Re-check when cookie changes (user accepts banner)
    const interval = setInterval(() => {
      const current = readConsent();
      setConsent((prev) => (prev !== current ? current : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (consent !== "all") return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
