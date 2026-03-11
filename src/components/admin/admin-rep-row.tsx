"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { revokeCompanyRepresentative } from "@/lib/actions/company-rep";
import { toast } from "sonner";

interface AdminRepRowProps {
  rep: {
    id: string;
    user_id: string;
    company_id: string;
    email: string;
    role: "admin" | "responder";
    verified_at: string | null;
    created_at: string;
    companies: { name: string; slug: string } | null;
  };
}

export function AdminRepRow({ rep }: AdminRepRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleRevoke() {
    if (!confirm(`Revoke ${rep.email} as a representative for ${rep.companies?.name}?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await revokeCompanyRepresentative(rep.id);
        toast.success("Representative revoked");
      } catch {
        toast.error("Failed to revoke representative");
      }
    });
  }

  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{rep.companies?.name ?? "Unknown"}</span>
            <Badge
              className={
                rep.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }
            >
              {rep.role}
            </Badge>
            {rep.verified_at && (
              <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {rep.email} &middot; Added{" "}
            {new Date(rep.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleRevoke}
          disabled={isPending}
        >
          {isPending ? "Revoking..." : "Revoke"}
        </Button>
      </div>
    </Card>
  );
}
