"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { MODERATION_REASONS } from "@/lib/constants";
import { toast } from "sonner";

interface FlagReportDialogProps {
  interviewId: string;
  children: React.ReactNode;
}

export function FlagReportDialog({ interviewId, children }: FlagReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("moderation_flags").insert({
        interview_id: interviewId,
        reason: selectedReason,
      });

      if (error) throw error;

      toast.success("Report submitted. We'll review this experience.");
      setOpen(false);
      setSelectedReason("");
    } catch {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report this experience</DialogTitle>
          <DialogDescription>
            Help us maintain quality. Select a reason for flagging this review.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          {MODERATION_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`rounded-md border px-4 py-2.5 text-left text-sm transition-colors ${
                selectedReason === reason
                  ? "border-primary bg-primary/5 font-medium"
                  : "hover:bg-accent"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
