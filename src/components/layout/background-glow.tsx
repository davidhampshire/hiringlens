"use client";

import { usePathname } from "next/navigation";

export function BackgroundGlow() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-500"
      style={{ opacity: isHome ? 1 : 0.25 }}
    >
      <div className="absolute -top-48 -right-48 h-[600px] w-[600px] rounded-full bg-emerald-400/15 blur-[140px]" />
      <div className="absolute -bottom-32 -left-48 h-[500px] w-[500px] rounded-full bg-emerald-300/10 blur-[120px]" />
    </div>
  );
}
