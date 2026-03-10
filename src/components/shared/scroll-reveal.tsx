"use client";

import { useReveal } from "@/hooks/use-reveal";

/** Drop this component into any page to activate scroll-triggered `.reveal` animations */
export function ScrollReveal() {
  useReveal();
  return null;
}
