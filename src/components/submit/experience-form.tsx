"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, type InterviewFormData } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { LinkedInButton } from "@/components/auth/linkedin-button";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  APPLICATION_SOURCE_LABELS,
  RECOMMEND_APPLYING_LABELS,
  JD_ACCURACY_LABELS,
} from "@/lib/constants";
import { toast } from "sonner";

interface EditData {
  id: string;
  company_name: string;
  company_id: string;
  industry?: string;
  role_title: string;
  seniority?: string;
  location?: string;
  interview_type?: string;
  salary_range?: string;
  display_name?: string | null;
  stages_count?: number | null;
  total_duration_days?: number | null;
  outcome?: string;
  received_feedback: boolean;
  unpaid_task: boolean;
  ghosted: boolean;
  interviewer_late: boolean;
  exceeded_timeline: boolean;
  professionalism_rating: number;
  communication_rating: number;
  clarity_rating: number;
  fairness_rating: number;
  company_website?: string;
  application_source?: string;
  recommend_applying?: string;
  interview_questions?: string;
  interview_date?: string;
  department?: string;
  jd_accuracy?: string;
  overall_comments?: string | null;
  candidate_tip?: string | null;
}

interface ExperienceFormProps {
  prefilledCompany?: string;
  editData?: EditData;
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
  { id: "company", label: "Company", skippable: false },
  { id: "outcome", label: "How did it go?", skippable: true },
  { id: "role", label: "Role Details", skippable: false },
  { id: "process", label: "Interview Process", skippable: true },
  { id: "ratings", label: "Rate the Experience", skippable: false },
  { id: "flags", label: "Red Flags", skippable: true },
  { id: "advice", label: "Your Advice", skippable: false },
] as const;

const FORM_STORAGE_KEY = "hiringlens_draft";

function AuthBanner({ isSignedIn, onSaveDraft }: { isSignedIn: boolean; onSaveDraft: () => void }) {
  if (isSignedIn) return null;
  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-start gap-3">
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
        <div>
          <p className="text-sm font-semibold text-amber-900">A free account is required to submit</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
            We link every review to a verified account to keep things fair, spam-free, and trustworthy for everyone. Your details stay private — only your first name is shown publicly.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <LinkedInButton redirectTo="/submit" onBeforeRedirect={onSaveDraft} />
        <p className="text-center text-xs text-amber-700/60">Fastest option — auto-fills your profile details</p>
        <div className="flex items-center gap-2 py-1">
          <div className="h-px flex-1 bg-amber-200" />
          <span className="text-xs text-amber-600">or continue with email</span>
          <div className="h-px flex-1 bg-amber-200" />
        </div>
        <div className="flex gap-2">
          <Link
            href="/sign-in?redirectTo=/submit"
            className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-2 text-center text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50"
            onClick={onSaveDraft}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up?redirectTo=/submit"
            className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-2 text-center text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50"
            onClick={onSaveDraft}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ExperienceForm({ prefilledCompany, editData }: ExperienceFormProps) {
  const router = useRouter();
  const isEditMode = !!editData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [truthfulnessConfirmed, setTruthfulnessConfirmed] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(
    editData ? !editData.display_name : true
  );

  function cleanCommentsForEdit(text: string | null): string {
    if (!text) return "";
    const idx = text.indexOf("---FOLLOW_UP_DATA---");
    if (idx === -1) return text;
    return text.substring(0, idx).trim();
  }

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: editData
      ? {
          company_name: editData.company_name,
          company_id: editData.company_id,
          industry: editData.industry ?? undefined,
          role_title: editData.role_title,
          seniority: (editData.seniority as InterviewFormData["seniority"]) ?? undefined,
          location: editData.location ?? "",
          interview_type: (editData.interview_type as InterviewFormData["interview_type"]) ?? undefined,
          salary_range: editData.salary_range ?? undefined,
          display_name: editData.display_name ?? "",
          stages_count: editData.stages_count ?? undefined,
          total_duration_days: editData.total_duration_days ?? undefined,
          outcome: (editData.outcome as InterviewFormData["outcome"]) ?? undefined,
          received_feedback: editData.received_feedback,
          unpaid_task: editData.unpaid_task,
          ghosted: editData.ghosted,
          interviewer_late: editData.interviewer_late,
          exceeded_timeline: editData.exceeded_timeline,
          professionalism_rating: editData.professionalism_rating,
          communication_rating: editData.communication_rating,
          clarity_rating: editData.clarity_rating,
          fairness_rating: editData.fairness_rating,
          company_website: editData.company_website ?? "",
          application_source: (editData.application_source as InterviewFormData["application_source"]) ?? undefined,
          recommend_applying: (editData.recommend_applying as InterviewFormData["recommend_applying"]) ?? undefined,
          interview_questions: editData.interview_questions ?? "",
          interview_date: editData.interview_date ?? "",
          department: editData.department ?? "",
          jd_accuracy: (editData.jd_accuracy as InterviewFormData["jd_accuracy"]) ?? undefined,
          overall_comments: cleanCommentsForEdit(editData.overall_comments ?? null),
          candidate_tip: editData.candidate_tip ?? "",
        }
      : {
          company_name: prefilledCompany ?? "",
          company_id: undefined,
          industry: undefined,
          role_title: "",
          seniority: undefined,
          location: "",
          interview_type: undefined,
          salary_range: undefined,
          display_name: "",
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
          company_website: "",
          application_source: undefined,
          recommend_applying: undefined,
          interview_questions: "",
          interview_date: "",
          department: "",
          jd_accuracy: undefined,
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

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsSignedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session?.user);
    });

    if (isEditMode) return () => subscription.unsubscribe();
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as {
          formData: Partial<InterviewFormData>;
          followUps?: Record<string, Record<string, string>>;
          step?: number;
        };
        for (const [key, value] of Object.entries(draft.formData)) {
          if (value !== undefined && value !== null && value !== "") {
            setValue(key as keyof InterviewFormData, value as never);
          }
        }
        if (draft.followUps) {
          setFollowUpAnswers(draft.followUps);
        }
        if (draft.step != null) {
          setCurrentStep(draft.step);
        }
        localStorage.removeItem(FORM_STORAGE_KEY);
        toast.success("Your draft has been restored.");
      }
    } catch {
      // ignore
    }

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = useCallback(() => {
    try {
      const currentData = form.getValues();
      localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify({ formData: currentData, followUps: followUpAnswers, step: currentStep })
      );
    } catch {
      // ignore
    }
  }, [form, followUpAnswers, currentStep]);

  function handleFollowUpChange(flagKey: string, questionId: string, value: string) {
    setFollowUpAnswers((prev) => ({
      ...prev,
      [flagKey]: { ...(prev[flagKey] ?? {}), [questionId]: value },
    }));
  }

  async function handleNext() {
    const stepId = FORM_STEPS[currentStep].id;
    let valid = true;

    if (stepId === "company") {
      valid = await form.trigger("company_name");
    } else if (stepId === "role") {
      valid = await form.trigger("role_title");
    } else if (stepId === "ratings") {
      valid = await form.trigger([
        "professionalism_rating",
        "communication_rating",
        "clarity_rating",
        "fairness_rating",
      ]);
    }

    if (!valid) return;
    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSkip() {
    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: InterviewFormData) {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        saveDraft();
        setIsSubmitting(false);
        toast("Create an account to submit your experience. Your progress has been saved.");
        router.push("/sign-up?redirectTo=/submit");
        return;
      }

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

      if (isEditMode) {
        const { updateInterview } = await import("@/lib/actions/interview");
        const result = await updateInterview(editData!.id, {
          formData: data as unknown as Record<string, unknown>,
          followUpData: activeFollowUps,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success("Your experience has been updated and will be re-reviewed.");
        router.push("/account");
        return;
      }

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
      toast.success("Thanks for sharing! Your experience will be visible after review.");
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
            setCurrentStep(0);
            form.reset();
          }}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const step = FORM_STEPS[currentStep];
  const progressPct = ((currentStep + 1) / FORM_STEPS.length) * 100;
  const animClass =
    direction === "forward"
      ? "animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out"
      : "animate-in fade-in slide-in-from-top-6 duration-500 ease-out";

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {currentStep + 1} / {FORM_STEPS.length}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{step.label}</span>
        </div>
        <div className="h-1 w-full rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-foreground transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step content */}
        <div key={`${currentStep}-${direction}`} className={animClass}>

          {/* ── Step 1: Company ── */}
          {step.id === "company" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold leading-tight">Which company did you interview with?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Search by name or add a new one</p>
              </div>

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
                  <label className="mb-1.5 block text-sm font-medium">Industry</label>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Company Website</label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    {...register("company_website")}
                  />
                  {errors.company_website && (
                    <p className="mt-1 text-xs text-destructive">{errors.company_website.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">How did you find this role?</label>
                  <Select
                    value={watch("application_source") ?? ""}
                    onValueChange={(v) =>
                      setValue("application_source", v as InterviewFormData["application_source"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(APPLICATION_SOURCE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Outcome ── */}
          {step.id === "outcome" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-tight">How did the interview go?</h2>
                <p className="mt-1 text-sm text-muted-foreground">This helps frame the rest of your feedback</p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {Object.entries(OUTCOME_LABELS).map(([value, label]) => {
                    const isSelected = currentOutcome === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValue("outcome", isSelected ? undefined : (value as InterviewFormData["outcome"]))
                        }
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                          isSelected
                            ? OUTCOME_COLORS[value] + " ring-1 ring-primary/20 shadow-sm"
                            : "border-muted bg-muted/20 hover:bg-muted/50 hover:border-muted-foreground/20"
                        }`}
                      >
                        <span className="text-xl" aria-hidden="true">{OUTCOME_ICONS[value]}</span>
                        <span className={`text-xs font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {currentOutcome && (
                  <div className={`mt-2.5 rounded-lg px-3 py-2 text-sm ${OUTCOME_COLORS[currentOutcome]}`}>
                    {OUTCOME_CONTEXT_MESSAGES[currentOutcome]}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground">Would you recommend applying here?</p>
                <p className="text-xs text-muted-foreground">Based on the overall experience</p>
                <div className="flex gap-2 pt-1">
                  {Object.entries(RECOMMEND_APPLYING_LABELS).map(([value, label]) => {
                    const isSelected = watch("recommend_applying") === value;
                    const colorClass =
                      value === "yes"
                        ? isSelected
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-muted bg-muted/20 hover:bg-emerald-50/50 hover:border-emerald-200"
                        : value === "maybe"
                          ? isSelected
                            ? "border-amber-300 bg-amber-50 text-amber-800 shadow-sm"
                            : "border-muted bg-muted/20 hover:bg-amber-50/50 hover:border-amber-200"
                          : isSelected
                            ? "border-red-300 bg-red-50 text-red-800 shadow-sm"
                            : "border-muted bg-muted/20 hover:bg-red-50/50 hover:border-red-200";
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValue("recommend_applying", isSelected ? undefined : (value as InterviewFormData["recommend_applying"]))
                        }
                        className={`flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${colorClass}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground">Did the interview match the job description?</p>
                <p className="text-xs text-muted-foreground">Was the role as advertised?</p>
                <div className="flex gap-2 pt-1">
                  {Object.entries(JD_ACCURACY_LABELS).map(([value, label]) => {
                    const isSelected = watch("jd_accuracy") === value;
                    const colorClass =
                      value === "yes"
                        ? isSelected
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-muted bg-muted/20 hover:bg-emerald-50/50 hover:border-emerald-200"
                        : value === "somewhat"
                          ? isSelected
                            ? "border-amber-300 bg-amber-50 text-amber-800 shadow-sm"
                            : "border-muted bg-muted/20 hover:bg-amber-50/50 hover:border-amber-200"
                          : isSelected
                            ? "border-red-300 bg-red-50 text-red-800 shadow-sm"
                            : "border-muted bg-muted/20 hover:bg-red-50/50 hover:border-red-200";
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValue("jd_accuracy", isSelected ? undefined : (value as InterviewFormData["jd_accuracy"]))
                        }
                        className={`flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${colorClass}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Role ── */}
          {step.id === "role" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold leading-tight">Tell us about the role</h2>
                <p className="mt-1 text-sm text-muted-foreground">Help others find relevant experiences</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Role Title <span className="text-destructive">*</span>
                </label>
                <Input placeholder="e.g. Frontend Developer" {...register("role_title")} />
                {errors.role_title && (
                  <p className="mt-1 text-xs text-destructive">{errors.role_title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Location</label>
                <Input placeholder="e.g. London, Remote" {...register("location")} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Department / Team</label>
                <Input placeholder="e.g. Engineering, Marketing" {...register("department")} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Seniority</label>
                  <Select
                    value={watch("seniority") ?? ""}
                    onValueChange={(v) => setValue("seniority", v as InterviewFormData["seniority"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Interview Type</label>
                  <Select
                    value={watch("interview_type") ?? ""}
                    onValueChange={(v) => setValue("interview_type", v as InterviewFormData["interview_type"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Salary Range</label>
                <Select
                  value={watch("salary_range") ?? ""}
                  onValueChange={(v) => setValue("salary_range", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select range (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ── Step 4: Process ── */}
          {step.id === "process" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold leading-tight">About the interview process</h2>
                <p className="mt-1 text-sm text-muted-foreground">These details help candidates know what to expect</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Interview Date</label>
                <Input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("interview_date")}
                />
                <p className="mt-1 text-xs text-muted-foreground">When did the interview take place?</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Number of Stages</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    placeholder="e.g. 4"
                    {...register("stages_count", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Total Duration (days)</label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 21"
                    {...register("total_duration_days", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Ratings ── */}
          {step.id === "ratings" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold leading-tight">Rate the experience</h2>
                <p className="mt-1 text-sm text-muted-foreground">All ratings required — be honest!</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {(Object.entries(RATING_LABELS) as [keyof typeof RATING_LABELS, string][]).map(
                  ([key, label]) => (
                    <RatingInput
                      key={key}
                      label={label}
                      value={watch(key)}
                      onChange={(v) => setValue(key, v)}
                      error={errors[key]?.message}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* ── Step 6: Flags ── */}
          {step.id === "flags" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold leading-tight">Any red flags or highlights?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Toggle any that apply — follow-up details are optional but helpful
                </p>
              </div>

              <div className="space-y-3">
                {(
                  Object.entries(FLAG_LABELS) as [
                    keyof typeof FLAG_LABELS,
                    (typeof FLAG_LABELS)[keyof typeof FLAG_LABELS],
                  ][]
                ).map(([key, { label, description, positive, followUps }]) => (
                  <FlagToggle
                    key={key}
                    id={key}
                    label={label}
                    description={description}
                    positive={positive}
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
            </div>
          )}

          {/* ── Step 7: Advice + Submit ── */}
          {step.id === "advice" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold leading-tight">Share your advice</h2>
                <p className="mt-1 text-sm text-muted-foreground">Help future candidates prepare</p>
              </div>

              {/* Display name */}
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">How should we display your name?</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {isAnonymous
                        ? "Your review will be shown as \"Anonymous\""
                        : "Your name will be shown on your review"}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!isAnonymous}
                    onClick={() => {
                      const newAnon = !isAnonymous;
                      setIsAnonymous(newAnon);
                      if (newAnon) setValue("display_name", "");
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      !isAnonymous ? "bg-primary" : "bg-muted-foreground/25"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                        !isAnonymous ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {!isAnonymous && (
                  <div className="mt-3">
                    <Input placeholder="Your first name or nickname" {...register("display_name")} />
                    {errors.display_name && (
                      <p className="mt-1 text-xs text-destructive">{errors.display_name.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Questions asked during the interview
                </label>
                <Textarea
                  placeholder={`e.g. "Tell me about a time you disagreed with a team decision...", system design questions, take-home brief details`}
                  rows={4}
                  className="min-h-[100px]"
                  {...register("interview_questions")}
                />
                {errors.interview_questions && (
                  <p className="mt-1 text-xs text-destructive">{errors.interview_questions.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">Sharing questions helps future candidates prepare</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Tip for future candidates</label>
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
                  <p className="mt-1 text-xs text-destructive">{errors.candidate_tip.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Additional comments</label>
                <Textarea
                  placeholder="Anything else you'd like to share about the experience?"
                  rows={5}
                  className="min-h-[120px]"
                  {...register("overall_comments")}
                />
                {errors.overall_comments && (
                  <p className="mt-1 text-xs text-destructive">{errors.overall_comments.message}</p>
                )}
              </div>

              {/* Auth banner on last step */}
              {!isEditMode && isSignedIn === false && (
                <AuthBanner isSignedIn={false} onSaveDraft={saveDraft} />
              )}

              {/* Truthfulness */}
              {!isEditMode && (
                <div className="flex min-h-[44px] items-start gap-3">
                  <Checkbox
                    id="truthfulness"
                    checked={truthfulnessConfirmed}
                    onCheckedChange={(checked) => setTruthfulnessConfirmed(checked === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="truthfulness"
                    className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
                  >
                    This review is based on my genuine, first-hand experience and is truthful to the best of my knowledge. Read our{" "}
                    <Link
                      href="/guidelines"
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      Community Guidelines
                    </Link>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation — sticky so Back/Next stay anchored as step height changes */}
        <div className="sticky bottom-0 mt-8 flex items-center justify-between border-t bg-background/95 pt-5 pb-4 backdrop-blur-sm">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>

          <div className="flex items-center gap-4">
            {step.skippable && !isLastStep && (
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
              >
                Skip
              </button>
            )}

            {isLastStep ? (
              <Button
                type="submit"
                size="lg"
                className="px-8"
                disabled={isSubmitting || (!isEditMode && !truthfulnessConfirmed)}
                title={
                  !isEditMode && !truthfulnessConfirmed
                    ? "Please confirm your review is truthful to continue"
                    : undefined
                }
              >
                {isSubmitting
                  ? isEditMode ? "Saving..." : "Submitting..."
                  : isEditMode
                    ? "Save Changes"
                    : isSignedIn === false
                      ? "Create Account & Submit"
                      : "Submit Experience"}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} size="lg" className="gap-1.5 px-8">
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}
          </div>
        </div>

        {isLastStep && (
          <p className="mt-3 text-xs text-muted-foreground text-right">
            {isEditMode
              ? "Your edited submission will be re-reviewed before being published."
              : "Your submission will be reviewed before being published."}
          </p>
        )}
      </form>
    </div>
  );
}
