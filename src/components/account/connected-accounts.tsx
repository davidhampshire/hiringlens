"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { UserIdentity } from "@supabase/supabase-js";

interface ConnectedAccountsProps {
  linkedInIdentity: UserIdentity | null;
}

export function ConnectedAccounts({ linkedInIdentity }: ConnectedAccountsProps) {
  const router = useRouter();
  const [isUnlinking, setIsUnlinking] = useState(false);

  async function handleUnlink() {
    if (!linkedInIdentity) return;
    setIsUnlinking(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.unlinkIdentity(linkedInIdentity);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("LinkedIn account disconnected.");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUnlinking(false);
    }
  }

  return (
    <div className="rounded-lg border p-5">
      <h3 className="text-sm font-semibold">Connected Accounts</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Manage your linked sign-in methods
      </p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2]/10">
            <svg className="h-4 w-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">LinkedIn</p>
            <p className="text-xs text-muted-foreground">
              {linkedInIdentity ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>

        {linkedInIdentity ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnlink}
            disabled={isUnlinking}
            className="text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/30"
          >
            {isUnlinking ? "Disconnecting..." : "Disconnect"}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}
