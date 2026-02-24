"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, type InterviewFormData } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CompanySearchInput } from "./company-search-input";
import { RatingInput } from "./rating-input";
import { FlagToggle } from "./flag-toggle";
import {
  INDUSTRIES,
  SENIORITY_LABELS,
  INTERVIEW_TYPE_LABELS,
  OUTCOME_LABELS,
  FLAG_LABELS,
  RATING_LABELS,
} from "@/lib/constants";
import { toast } from "sonner";

interface ExperienceFormProps {
  prefilledCompany?: string;
}

const OUTCOME_ICONS: Record<string, string> = {
  offer: "🎉",
  rejected: "✗",
  ghosted: "👻",
  withdrew: "🚪",
  pending: "⏳",
};

const OUTCOME_COLORS: Record<string, string> = {
  offer: "border-emerald-200 bg-emerald-50/50",
  rejected: "border-red-200 bg-red-50/50",
  ghosted: "border-slate-200 bg-slate-50/50",
  withdrew: "border-amber-200 bg-amber-50/50",
  pending: "border-blue-200 bg-blue-50/50",
};

const OUTCOME_CONTEXT_MESSAGES: Record<string, string> = {
  offer:
    "Congrats! Your positive experience can help others know what to expect.",
  rejected:
    "Your honest feedback helps others prepare and pushes companies to improve.",
  ghosted:
    "Being ghosted is frustrating — sharing this helps hold companies accountable.",
  withdrew:
    "Understanding why candidates withdraw helps companies improve their process.",
  pending:
    "You can always come back and update this once you have a final outcome.",
};

export function ExperienceForm({ prefilledCompany }: ExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, Record<string, string>>
  >({});

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      company_name: prefilledCompany ?? "",
      company_id: undefined,
      industry: undefined,
      role_title: "",
      seniority: undefined,
      location: "",
      interview_type: undefined,
      stages_count: undefined,
      total_duration_days: undefined,
      outcome: undefined,
      received_feedback: false,
      unpaid_task: false,
      ghosted: false,
      interviewer_late: false,
      exceeded_timeline: false,
      professionalism_rating: 0,
      communication_rating: 0,
      clarity_rating: 0,
      fairness_rating: 0,
      overall_comments: "",
      candidate_tip: "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const currentOutcome = watch("outcome");

  function handleFollowUpChange(
    flagKey: string,
    questionId: string,
    value: string
  ) {
    setFollowUpAnswers((prev) => ({
      ...prev,
      [flagKey]: {
        ...(prev[flagKey] ?? {}),
        [questionId]: value,
      },
    }));
  }

  async function onSubmit(data: InterviewFormData) {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      let companyId = data.company_id;

      // Create company if new
      if (!companyId) {
        const slug = slugify(data.company_name);
        const { data: existingCompany } = await supabase
          .from("companies")
          .select("id")
          .eq("slug", slug)
          .single();

        if (existingCompany) {
          companyId = existingCompany.id;
        } else {
          const { data: newCompany, error: companyError } = await supabase
            .from("companies")
            .insert({
              name: data.company_name.trim(),
              slug,
              industry: data.industry ?? null,
            })
            .select("id")
            .single();

          if (companyError) throw companyError;
          companyId = newCompany.id;
        }
      }

      // Collect follow-up data — only include answers for active flags
      const activeFollowUps: Record<string, Record<string, string>> = {};
      for (const [flagKey, answers] of Object.entries(followUpAnswers)) {
        const flagValue = data[flagKey as keyof InterviewFormData];
        if (flagValue === true && Object.keys(answers).length > 0) {
          // Filter out empty answers
          const nonEmpty = Object.fromEntries(
            Object.entries(answers).filter(([, v]) => v.trim() !== "")
          );
          if (Object.keys(nonEmpty).length > 0) {
            activeFollowUps[flagKey] = nonEmpty;
          }
        }
      }

      // Build comments with structured follow-up data
      let commentsPayload = data.overall_comments || "";
      if (Object.keys(activeFollowUps).length > 0) {
        const followUpJson = JSON.stringify(activeFollowUps);
        commentsPayload = commentsPayload
          ? `${commentsPayload}\n\n---FOLLOW_UP_DATA---\n${followUpJson}`
          : `---FOLLOW_UP_DATA---\n${followUpJson}`;
      }

      // Create interview
      const { error: interviewError } = await supabase
        .from("interviews")
        .insert({
          company_id: companyId,
          role_title: data.role_title,
          seniority: data.seniority ?? null,
          location: data.location || null,
          interview_type: data.interview_type ?? null,
          stages_count: data.stages_count ?? null,
          total_duration_days: data.total_duration_days ?? null,
          outcome: data.outcome ?? null,
          received_feedback: data.received_feedback,
          unpaid_task: data.unpaid_task,
          ghosted: data.ghosted,
          interviewer_late: data.interviewer_late,
          exceeded_timeline: data.exceeded_timeline,
          professionalism_rating: data.professionalism_rating,
          communication_rating: data.communication_rating,
          clarity_rating: data.clarity_rating,
          fairness_rating: data.fairness_rating,
          overall_comments: commentsPayload || null,
          candidate_tip: data.candidate_tip || null,
          status: "pending",
        });

      if (interviewError) throw interviewError;

      setIsSuccess(true);
      toast.success(
        "Thanks for sharing! Your experience will be visible after review."
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-50">
          <svg
            className="h-8 w-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Experience Submitted</h2>
        <p className="mt-2 text-muted-foreground">
          Your interview experience has been submitted for review. It will be
          visible to other candidates once approved. Thank you for helping the
          community!
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            setIsSuccess(false);
            setFollowUpAnswers({});
            form.reset();
          }}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Company Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Company</h2>
        <div className="space-y-4">
          <CompanySearchInput
            value={watch("company_name")}
            selectedId={watch("company_id")}
            onChange={(name, id) => {
              setValue("company_name", name);
              setValue("company_id", id as string | undefined);
            }}
            error={errors.company_name?.message}
          />

          {!watch("company_id") && watch("company_name").length >= 2 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Industry
              </label>
              <Select
                value={watch("industry") ?? ""}
                onValueChange={(v) => setValue("industry", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* Outcome — Prominent placement near top */}
      <section>
        <h2 className="mb-1 text-lg font-semibold">How did it go?</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          This helps frame the rest of your feedback
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Object.entries(OUTCOME_LABELS).map(([value, label]) => {
            const isSelected = currentOutcome === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setValue(
                    "outcome",
                    isSelected
                      ? undefined
                      : (value as InterviewFormData["outcome"])
                  )
                }
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all ${
                  isSelected
                    ? OUTCOME_COLORS[value] + " border-2 ring-1 ring-primary/20"
                    : "border-transparent bg-muted/30 hover:bg-muted/60"
                }`}
              >
                <span className="text-lg" aria-hidden="true">
                  {OUTCOME_ICONS[value]}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contextual message based on outcome */}
        {currentOutcome && (
          <div
            className={`mt-3 rounded-md px-3 py-2 text-sm ${OUTCOME_COLORS[currentOutcome]}`}
          >
            {OUTCOME_CONTEXT_MESSAGES[currentOutcome]}
          </div>
        )}
      </section>

      <Separator />

      {/* Role Details */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Role Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Role Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Frontend Developer"
              {...register("role_title")}
            />
            {errors.role_title && (
              <p className="mt-1 text-xs text-destructive">
                {errors.role_title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Seniority
            </label>
            <Select
              value={watch("seniority") ?? ""}
              onValueChange={(v) =>
                setValue("seniority", v as InterviewFormData["seniority"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Location
            </label>
            <Input placeholder="e.g. London, Remote" {...register("location")} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Interview Type
            </label>
            <Select
              value={watch("interview_type") ?? ""}
              onValueChange={(v) =>
                setValue(
                  "interview_type",
                  v as InterviewFormData["interview_type"]
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Process Metrics */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Process</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Number of Stages
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              placeholder="e.g. 4"
              {...register("stages_count", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Total Duration (days)
            </label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 21"
              {...register("total_duration_days", { valueAsNumber: true })}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Ratings */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Ratings <span className="text-destructive">*</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {(
            Object.entries(RATING_LABELS) as [
              keyof typeof RATING_LABELS,
              string,
            ][]
          ).map(([key, label]) => (
            <RatingInput
              key={key}
              label={label}
              value={watch(key)}
              onChange={(v) => setValue(key, v)}
              error={errors[key]?.message}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* Experience Flags with Follow-ups */}
      <section>
        <h2 className="mb-1 text-lg font-semibold">Experience Flags</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Toggle any that apply — follow-up details are optional but help paint
          a fuller picture
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            Object.entries(FLAG_LABELS) as [
              keyof typeof FLAG_LABELS,
              (typeof FLAG_LABELS)[keyof typeof FLAG_LABELS],
            ][]
          ).map(([key, { label, description, followUps }]) => (
            <FlagToggle
              key={key}
              id={key}
              label={label}
              description={description}
              checked={watch(key) as boolean}
              onCheckedChange={(checked) => {
                setValue(key, checked);
                // Clear follow-up answers when flag is turned off
                if (!checked) {
                  setFollowUpAnswers((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                  });
                }
              }}
              followUps={followUps}
              followUpValues={followUpAnswers[key] ?? {}}
              onFollowUpChange={(questionId, value) =>
                handleFollowUpChange(key, questionId, value)
              }
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* Tips & Comments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Your Advice</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Tip for future candidates
            </label>
            <Textarea
              placeholder={
                currentOutcome === "offer"
                  ? "What helped you succeed in this interview?"
                  : currentOutcome === "rejected"
                    ? "What would you do differently next time?"
                    : "What advice would you give someone interviewing here?"
              }
              rows={3}
              {...register("candidate_tip")}
            />
            {errors.candidate_tip && (
              <p className="mt-1 text-xs text-destructive">
                {errors.candidate_tip.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Additional comments
            </label>
            <Textarea
              placeholder="Anything else you'd like to share about the experience?"
              rows={4}
              {...register("overall_comments")}
            />
            {errors.overall_comments && (
              <p className="mt-1 text-xs text-destructive">
                {errors.overall_comments.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="sticky bottom-0 border-t bg-background py-4 sm:static sm:border-0 sm:py-0">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Experience"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Your submission will be reviewed before being published.
        </p>
      </div>
    </form>
  );
}
