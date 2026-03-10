"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { togglePasswordGate } from "@/lib/actions/admin";
import { toast } from "sonner";

interface SiteSettingsProps {
  passwordGateEnabled: boolean;
}

export function SiteSettings({ passwordGateEnabled }: SiteSettingsProps) {
  const [enabled, setEnabled] = useState(passwordGateEnabled);
  const [loading, setLoading] = useState(false);

  async function handleToggle(checked: boolean) {
    setLoading(true);
    try {
      await togglePasswordGate(checked);
      setEnabled(checked);
      toast.success(
        checked
          ? "Password gate enabled — visitors must enter the password"
          : "Password gate disabled — site is now public"
      );
    } catch {
      toast.error("Failed to update setting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
        <h3 className="text-sm font-semibold">Site Settings</h3>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Password Gate</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {enabled
                ? "Site is password-protected — visitors must enter the password to access."
                : "Site is public — anyone can access without a password."}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={loading}
            aria-label="Toggle password gate"
          />
        </div>
        <div className="mt-3 rounded-md bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            <span className={enabled ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>
              {enabled ? "🔒 Protected" : "🌐 Public"}
            </span>
            {" · "}
            {enabled
              ? "Disable this when you're ready for testers or launch."
              : "Enable this to restrict access again."}
          </p>
        </div>
      </div>
    </Card>
  );
}
