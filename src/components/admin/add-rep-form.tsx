"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCompanyRepresentative } from "@/lib/actions/company-rep";
import { toast } from "sonner";

interface AddRepFormProps {
  companies: Array<{ id: string; name: string }>;
}

export function AddRepForm({ companies }: AddRepFormProps) {
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState<"admin" | "responder">("responder");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !companyId) return;

    const formData = new FormData();
    formData.set("user_email", email);
    formData.set("company_id", companyId);
    formData.set("role", role);

    startTransition(async () => {
      const result = await createCompanyRepresentative(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Representative added and notified by email");
        setEmail("");
        setCompanyId("");
        setRole("responder");
      }
    });
  }

  return (
    <Card className="gap-0 border-dashed p-0">
      <form onSubmit={handleSubmit} className="p-5">
        <h3 className="mb-3 text-sm font-semibold">Add Company Representative</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">
              User Email
            </label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9"
              required
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">
              Company
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              required
            >
              <option value="">Select company...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="mb-1 block text-xs text-muted-foreground">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "responder")}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="responder">Responder</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Adding..." : "Add Rep"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          The user must already have a HiringLens account. Verify their email domain matches the company before adding.
        </p>
      </form>
    </Card>
  );
}
