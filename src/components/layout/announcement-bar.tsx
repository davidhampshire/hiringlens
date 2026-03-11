"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type AnnouncementData = {
  messages: string[];
  intervalSeconds: number;
};

export function AnnouncementBar() {
  const [config, setConfig] = useState<AnnouncementData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("announcement_dismissed") === "1") {
      setDismissed(true);
      return;
    }

    async function fetchAnnouncements() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "announcements")
          .single();

        if (!data?.value) return;

        const raw = data.value;

        // Support both old format (string[]) and new format ({ messages, intervalSeconds })
        if (
          typeof raw === "object" &&
          !Array.isArray(raw) &&
          "messages" in (raw as Record<string, unknown>)
        ) {
          const cfg = raw as unknown as AnnouncementData;
          if (cfg.messages.length > 0) setConfig(cfg);
        } else if (Array.isArray(raw) && raw.length > 0) {
          setConfig({ messages: raw as string[], intervalSeconds: 5 });
        }
      } catch {
        // Silently fail
      }
    }

    fetchAnnouncements();
  }, []);

  // Rotate messages with fade
  const rotate = useCallback(() => {
    if (!config || config.messages.length <= 1) return;
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % config.messages.length);
      setVisible(true);
    }, 400);
  }, [config]);

  useEffect(() => {
    if (!config || config.messages.length <= 1) return;
    const timer = setInterval(rotate, config.intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [config, rotate]);

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("announcement_dismissed", "1");
  }

  if (dismissed || !config || config.messages.length === 0) return null;

  return (
    <div className="relative z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <p
          className={`flex-1 text-center text-sm font-medium transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {config.messages[currentIndex]}
        </p>

        <button
          onClick={handleDismiss}
          className="ml-3 shrink-0 rounded p-1 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          aria-label="Dismiss announcement"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
