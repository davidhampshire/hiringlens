"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
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

        if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
          setMessages(data.value as string[]);
        }
      } catch {
        // Silently fail — announcement bar is non-critical
      }
    }

    fetchAnnouncements();
  }, []);

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("announcement_dismissed", "1");
  }

  if (dismissed || messages.length === 0) return null;

  // Build the scrolling text: repeat messages with separator
  const scrollText = [...messages, ...messages, ...messages]
    .join("     ✦     ")
    .concat("     ✦     ");

  return (
    <div className="relative z-50 overflow-hidden bg-primary text-primary-foreground">
      <div className="flex items-center">
        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap py-2 text-sm font-medium">
            {scrollText}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="shrink-0 px-3 py-2 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
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
