"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitCompanyResponse, updateCompanyResponse } from "@/lib/actions/company-rep";
import { toast } from "sonner";

interface ResponseFormProps {
  interviewId: string;
  existingResponseId?: string;
  initialBody?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ResponseForm({
  interviewId,
  existingResponseId,
  initialBody = "",
  onSuccess,
  onCancel,
}: ResponseFormProps) {
  const [body, setBody] = useState(initialBody);
  const [isPending, startTransition] = useTransition();
  const isEdit = !!existingResponseId;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 20) {
      toast.error("Response must be at least 20 characters");
      return;
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateCompanyResponse(existingResponseId!, body.trim())
        : await submitCompanyResponse({
            interview_id: interviewId,
            body: body.trim(),
          });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEdit
            ? "Response updated"
            : "Response submitted — it will be reviewed before publishing"
        );
        onSuccess?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a professional, constructive response to this review..."
          maxLength={2000}
          rows={4}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {body.length}/2,000
        </p>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending || body.trim().length < 20}>
          {isPending ? "Submitting..." : isEdit ? "Update Response" : "Submit Response"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
