"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  onAction?: () => void;
  variant?: "desktop" | "mobile";
}

export function UserMenu({ onAction, variant = "desktop" }: UserMenuProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initial load + listen for client-side auth changes (e.g. OAuth, client signOut)
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Re-check auth whenever the route changes — catches server-action sign-in/sign-out redirects
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, [pathname]);

  async function handleSignOut() {
    onAction?.();
    const supabase = createClient();
    await supabase.auth.signOut(); // clears cookie + fires onAuthStateChange → email = null immediately
    router.push("/");
    router.refresh(); // invalidates server-component cache
  }

  // Loading skeleton — placeholder to prevent layout shift
  if (isLoading) {
    return (
      <div className="h-9 w-16 animate-pulse rounded-md bg-muted" />
    );
  }

  // Signed out — show Sign In link
  if (!email) {
    if (variant === "mobile") {
      return (
        <Link
          href="/sign-in"
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={onAction}
        >
          Sign In
        </Link>
      );
    }

    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  // Signed in — mobile variant (simple list)
  if (variant === "mobile") {
    return (
      <div className="space-y-1 border-t pt-2 mt-2">
        <Link
          href="/account"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={onAction}
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          My Account
        </Link>
        <button
          onClick={handleSignOut}
          className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Signed in — desktop dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs font-medium">My Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
