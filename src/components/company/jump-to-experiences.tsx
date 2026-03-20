"use client";

import { useEffect, useState } from "react";

export function JumpToExperiences({ totalReviews }: { totalReviews: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById("experiences");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.05 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#experiences"
      className="fixed bottom-6 left-4 right-4 z-40 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-lg transition-opacity duration-200 md:hidden"
    >
      Read {totalReviews} experience{totalReviews !== 1 ? "s" : ""} ↓
    </a>
  );
}
