"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moderateCompanyResponse, deleteCompanyResponse } from "@/lib/actions/company-rep";
import { toast } from "sonner";

interface AdminResponseRowProps {
  response: {
    id: string;
    interview_id: string;
    body: string;
    status: string;
    created_at: string;
    company_representatives: {
      email: string;
      companies: { name: string; slug: string } | null;
    } | null;
    interviews: { role_title: string } | null;
  };
}

export function AdminResponseRow({ response }: AdminResponseRowProps) {
  const [isPending, startTransition] = useTransition();

  const companyName = response.company_representatives?.companies?.name ?? "Unknown";
  const repEmail = response.company_representatives?.email ?? "";
  const roleTitle = response.interviews?.role_title ?? "Unknown role";

  function handlePublish() {
    startTransition(async () => {
      try {
        await moderateCompanyResponse(response.id, "published");
        toast.success("Response published");
      } catch {
        toast.error("Failed to publish response");
      }
    });
  }

  function handleHide() {
    startTransition(async () => {
      try {
        await moderateCompanyResponse(response.id, "hidden");
        toast.success("Response hidden");
      } catch {
        toast.error("Failed to hide response");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Permanently delete this response?")) return;

    startTransition(async () => {
      try {
        await deleteCompanyResponse(response.id);
        toast.success("Response deleted");
      } catch {
        toast.error("Failed to delete response");
      }
    });
  }

  return (
    <Card className="gap-0 p-0">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{companyName}</span>
              <Badge className="bg-muted text-muted-foreground">{roleTitle}</Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              by {repEmail} &middot;{" "}
              {new Date(response.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={handlePublish} disabled={isPending}>
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleHide}
              disabled={isPending}
            >
              Hide
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </Button>
          </div>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
          {response.body}
        </p>
      </div>
    </Card>
  );
}
