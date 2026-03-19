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

  // Focus first link when menu opens
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector("a");
      firstLink?.focus();
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-75">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">HL</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">Hiring<span className="text-foreground/40">Lens</span></span>
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
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
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
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" ref={menuRef} className="border-t px-4 pb-4 pt-2 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            <MobileSearchButton />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  isActive(link.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className="mt-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
              onClick={closeMenu}
            >
              Share Experience
            </Link>
            <UserMenu variant="mobile" onAction={closeMenu} />
          </nav>
        </div>
      )}
    </header>
  );
}
