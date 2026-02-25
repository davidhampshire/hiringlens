"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, type InterviewFormData } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
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
  SALARY_RANGES,
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
  offer: "\u{1F389}",
  rejected: "\u2717",
  ghosted: "\u{1F47B}",
  withdrew: "\u{1F6AA}",
  pending: "\u23F3",
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
    "Being ghosted is frustrating \u2014 sharing this helps hold companies accountable.",
  withdrew:
    "Understanding why candidates withdraw helps companies improve their process.",
  pending:
    "You can always come back and update this once you have a final outcome.",
};

const FORM_STEPS = [
  { id: "company", label: "Company", fields: ["company_name"] },
  { id: "outcome", label: "Outcome", fields: ["outcome"] },
  { id: "role", label: "Role Details", fields: ["role_title"] },
  { id: "process", label: "Process", fields: ["stages_count", "total_duration_days"] },
  { id: "ratings", label: "Ratings", fields: ["professionalism_rating", "communication_rating", "clarity_rating", "fairness_rating"] },
  { id: "flags", label: "Experience Flags", fields: [] },
  { id: "advice", label: "Your Advice", fields: ["candidate_tip", "overall_comments"] },
] as const;

const FORM_STORAGE_KEY = "hiringlens_draft";

function AuthBanner({ isSignedIn }: { isSignedIn: boolean }) {
  if (isSignedIn) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="text-sm">
        <p className="font-medium text-amber-900">
          You&apos;ll need an account to post
        </p>
        <p className="mt-0.5 text-amber-800/80">
          Start filling in your experience. When you&apos;re ready to submit, we&apos;ll
          ask you to{" "}
          <Link href="/sign-up" className="font-medium underline hover:text-amber-900">
            create a free account
          </Link>{" "}
          or{" "}
          <Link href="/sign-in" className="font-medium underline hover:text-amber-900">
            sign in
          </Link>
          . Your progress will be saved.
        </p>
      </div>
    </div>
  );
}

export function ExperienceForm({ prefilledCompany }: ExperienceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [activeStep, setActiveStep] = useState(0);

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
      salary_range: undefined,
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
  const watchedValues = watch();

  // Check auth state and restore saved draft
  useEffect(() => {
    const supabase = createClient();

    // Check initial auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsSignedIn(!!user);
    });

    // Listen for auth changes (e.g., user signs in in another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session?.user);
    });

    // Restore saved draft from localStorage
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as {
          formData: Partial<InterviewFormData>;
          followUps?: Record<string, Record<string, string>>;
        };
        // Restore form values
        for (const [key, value] of Object.entries(draft.formData)) {
          if (value !== undefined && value !== null && value !== "") {
            setValue(key as keyof InterviewFormData, value as never);
          }
        }
        // Restore follow-up answers
        if (draft.followUps) {
          setFollowUpAnswers(draft.followUps);
        }
        // Clear the draft after restoring
        localStorage.removeItem(FORM_STORAGE_KEY);
        toast.success("Your draft has been restored.");
      }
    } catch {
      // Ignore parse errors
    }

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save current form to localStorage (called before redirect)
  const saveDraft = useCallback(() => {
    try {
      const currentData = form.getValues();
      localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify({ formData: currentData, followUps: followUpAnswers })
      );
    } catch {
      // Ignore storage errors
    }
  }, [form, followUpAnswers]);

  function isFlagsCompleted(): boolean {
    return !!(
      watchedValues.received_feedback ||
      watchedValues.unpaid_task ||
      watchedValues.ghosted ||
      watchedValues.interviewer_late ||
      watchedValues.exceeded_timeline
    );
  }

  // Track which steps are completed
  useEffect(() => {
    function getCompletedSteps(): boolean[] {
      return FORM_STEPS.map((step) => {
        switch (step.id) {
          case "company":
            return !!watchedValues.company_name && watchedValues.company_name.length >= 2;
          case "outcome":
            return !!watchedValues.outcome;
          case "role":
            return !!watchedValues.role_title;
          case "process":
            return !!(watchedValues.stages_count || watchedValues.total_duration_days);
          case "ratings":
            return (
              watchedValues.professionalism_rating > 0 &&
              watchedValues.communication_rating > 0 &&
              watchedValues.clarity_rating > 0 &&
              watchedValues.fairness_rating > 0
            );
          case "flags":
            return isFlagsCompleted();
          case "advice":
            return !!(watchedValues.candidate_tip || watchedValues.overall_comments);
          default:
            return false;
        }
      });
    }

    const completed = getCompletedSteps();
    // Find the first incomplete step that isn't flags
    const firstIncomplete = completed.findIndex(
      (c, i) => !c && FORM_STEPS[i].id !== "flags"
    );
    if (firstIncomplete >= 0) {
      setActiveStep(firstIncomplete);
    } else {
      setActiveStep(FORM_STEPS.length - 1);
    }
  }, [watchedValues]);

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

  function scrollToStep(stepId: string) {
    const el = document.getElementById(`step-${stepId}`);
    if (el) {
      // Offset for sticky header (desktop ~64px, mobile ~64px header + ~40px progress bar)
      const headerOffset = window.innerWidth >= 1024 ? 80 : 120;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // Compute completed count for progress
  const completedCount = FORM_STEPS.filter((step) => {
    switch (step.id) {
      case "company":
        return !!watchedValues.company_name && watchedValues.company_name.length >= 2;
      case "outcome":
        return !!watchedValues.outcome;
      case "role":
        return !!watchedValues.role_title;
      case "process":
        return !!(watchedValues.stages_count || watchedValues.total_duration_days);
      case "ratings":
        return (
          watchedValues.professionalism_rating > 0 &&
          watchedValues.communication_rating > 0 &&
          watchedValues.clarity_rating > 0 &&
          watchedValues.fairness_rating > 0
        );
      case "flags":
        return isFlagsCompleted();
      case "advice":
        return !!(watchedValues.candidate_tip || watchedValues.overall_comments);
      default:
        return false;
    }
  }).length;

  async function onSubmit(data: InterviewFormData) {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If not signed in, save draft and redirect to sign-up
      if (!user) {
        saveDraft();
        setIsSubmitting(false);
        toast("Create an account to submit your experience. Your progress has been saved.");
        router.push("/sign-up?redirectTo=/submit");
        return;
      }

      // Collect follow-up data
      const activeFollowUps: Record<string, Record<string, string>> = {};
      for (const [flagKey, answers] of Object.entries(followUpAnswers)) {
        const flagValue = data[flagKey as keyof InterviewFormData];
        if (flagValue === true && Object.keys(answers).length > 0) {
          const nonEmpty = Object.fromEntries(
            Object.entries(answers).filter(([, v]) => v.trim() !== "")
          );
          if (Object.keys(nonEmpty).length > 0) {
            activeFollowUps[flagKey] = nonEmpty;
          }
        }
      }

      // Submit via server action (handles rate limiting, company creation, insert)
      const { submitInterview } = await import("@/lib/actions/interview");
      const result = await submitInterview({
        formData: data as unknown as Record<string, unknown>,
        followUpData: activeFollowUps,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      localStorage.removeItem(FORM_STORAGE_KEY);
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
    <div className="flex gap-8">
      {/* Step Progress Sidebar — desktop only */}
      <aside className="hidden lg:block w-48 shrink-0">
        <div className="sticky top-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Progress ({completedCount}/{FORM_STEPS.length})
          </p>
          <nav className="space-y-1">
            {FORM_STEPS.map((step, i) => {
              const isCompleted = (() => {
                switch (step.id) {
                  case "company":
                    return !!watchedValues.company_name && watchedValues.company_name.length >= 2;
                  case "outcome":
                    return !!watchedValues.outcome;
                  case "role":
                    return !!watchedValues.role_title;
                  case "process":
                    return !!(watchedValues.stages_count || watchedValues.total_duration_days);
                  case "ratings":
                    return (
                      watchedValues.professionalism_rating > 0 &&
                      watchedValues.communication_rating > 0 &&
                      watchedValues.clarity_rating > 0 &&
                      watchedValues.fairness_rating > 0
                    );
                  case "flags":
                    return isFlagsCompleted();
                  case "advice":
                    return !!(watchedValues.candidate_tip || watchedValues.overall_comments);
                  default:
                    return false;
                }
              })();
              const isActive = i === activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => scrollToStep(step.id)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-primary/5 font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  {step.label}
                </button>
              );
            })}
          </nav>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(completedCount / FORM_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile progress bar */}
      <div className="fixed left-0 right-0 top-[57px] z-30 bg-background/95 backdrop-blur px-4 py-2 border-b lg:hidden">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Step {activeStep + 1} of {FORM_STEPS.length}: {FORM_STEPS[activeStep].label}</span>
          <span>{completedCount}/{FORM_STEPS.length} complete</span>
        </div>
        <div className="h-1 w-full rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${(completedCount / FORM_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-w-0 space-y-8 pt-10 lg:pt-0">
        {/* Auth banner — top */}
        {isSignedIn === false && <AuthBanner isSignedIn={false} />}

        {/* Company Section */}
        <section id="step-company" className="scroll-mt-28 lg:scroll-mt-20">
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

        {/* Outcome */}
        <section id="step-outcome" className="scroll-mt-28 lg:scroll-mt-20">
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

          {currentOutcome && (
            <div
              className={`mt-3 rounded-md px-3 py-2 text-sm ${OUTCOME_COLORS[currentOutcome]}`}
            >
              {OUTCOME_CONTEXT_MESSAGES[currentOutcome]}
            </div>
          )}
        </section>

        <Separator />

        {/* Role Details — full-width fields */}
        <section id="step-role" className="scroll-mt-28 lg:scroll-mt-20">
          <h2 className="mb-4 text-lg font-semibold">Role Details</h2>
          <div className="space-y-4">
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
                Location
              </label>
              <Input placeholder="e.g. London, Remote" {...register("location")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Salary Range
              </label>
              <Select
                value={watch("salary_range") ?? ""}
                onValueChange={(v) => setValue("salary_range", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        {/* Process Metrics */}
        <section id="step-process" className="scroll-mt-28 lg:scroll-mt-20">
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
        <section id="step-ratings" className="scroll-mt-28 lg:scroll-mt-20">
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

        {/* Experience Flags — stacked vertically */}
        <section id="step-flags" className="scroll-mt-28 lg:scroll-mt-20">
          <h2 className="mb-1 text-lg font-semibold">Experience Flags</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Toggle any that apply. Follow-up details are optional but help paint
            a fuller picture
          </p>
          <div className="space-y-3">
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

        {/* Tips & Comments — deeper textareas */}
        <section id="step-advice" className="scroll-mt-28 lg:scroll-mt-20">
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
                rows={5}
                className="min-h-[120px]"
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
                rows={6}
                className="min-h-[150px]"
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

        {/* Auth banner — bottom */}
        {isSignedIn === false && <AuthBanner isSignedIn={false} />}

        {/* Submit */}
        <div className="sticky bottom-0 border-t bg-background py-4 sm:static sm:border-0 sm:py-0">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : isSignedIn === false
                ? "Create Account & Submit"
                : "Submit Experience"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Your submission will be reviewed before being published.
          </p>
        </div>
      </form>
    </div>
  );
}
