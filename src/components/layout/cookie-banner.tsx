"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function getConsent(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setConsent(value: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-5">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            We use cookies to improve your experience and analyse site usage.{" "}
            <Link
              href="/cookies"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setConsent("essential");
              setVisible(false);
            }}
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setConsent("all");
              setVisible(false);
            }}
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
