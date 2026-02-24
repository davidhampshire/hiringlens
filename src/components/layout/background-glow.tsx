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
      <div className="absolute -top-32 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-[140px]" />
      <div className="absolute top-[350px] -right-32 h-[450px] w-[550px] rounded-full bg-emerald-300/10 blur-[110px]" />
      <div className="absolute top-[600px] -left-40 h-[350px] w-[450px] rounded-full bg-emerald-200/6 blur-[100px]" />
    </div>
  );
}
