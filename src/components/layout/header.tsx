"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SearchTrigger, MobileSearchButton } from "./search-dialog";
import { UserMenu } from "@/components/auth/user-menu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Reviews", href: "/recent" },
  { label: "Companies", href: "/companies" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Insights", href: "/insights" },
  { label: "Compare", href: "/compare" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMenu]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Focus first link when menu opens
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector("a");
      firstLink?.focus();
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-75">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary sm:h-8 sm:w-8">
            <span className="text-sm font-bold text-primary-foreground">HL</span>
          </div>
          <span className="text-xl font-semibold tracking-tight sm:text-lg">Hiring<span className="text-foreground/40">Lens</span></span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-5 lg:gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "py-1.5 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <SearchTrigger />
          <UserMenu />
          <Link
            href="/submit"
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90",
              isActive("/submit") && "ring-2 ring-primary/30"
            )}
            aria-current={isActive("/submit") ? "page" : undefined}
          >
            Share Experience
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          className="flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Full-page mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-[9999] flex flex-col bg-white md:hidden"
          style={{ backgroundColor: "white" }}
        >
          {/* Top bar — logo + close */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b px-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2 transition-opacity hover:opacity-75"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">HL</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Hiring<span className="text-foreground/40">Lens</span>
              </span>
            </Link>
            <button
              onClick={closeMenu}
              className="flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent"
              aria-label="Close menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav links — centred vertically */}
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6">
            <MobileSearchButton />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b py-5 text-xl font-medium transition-colors",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom — CTA + account */}
          <div className="shrink-0 space-y-3 px-6 pb-10 pt-4">
            <Link
              href="/submit"
              className="block w-full rounded-md bg-primary px-4 py-4 text-center text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={closeMenu}
            >
              Share Experience
            </Link>
            <UserMenu variant="mobile" onAction={closeMenu} />
          </div>
        </div>
      )}
    </header>
  );
}
