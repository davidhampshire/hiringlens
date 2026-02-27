"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FollowUpQuestion {
  id: string;
  label: string;
  type: "select" | "text";
  options?: readonly string[];
  placeholder?: string;
}

interface FlagToggleProps {
  id: string;
  label: string;
  description: string;
  positive: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  followUps?: readonly FollowUpQuestion[];
  followUpValues?: Record<string, string>;
  onFollowUpChange?: (questionId: string, value: string) => void;
}

/* ── Icon map ─────────────────────────────────────────────────────────── */
const FLAG_ICONS: Record<string, React.ReactNode> = {
  received_feedback: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  unpaid_task: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  ghosted: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  ),
  interviewer_late: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  exceeded_timeline: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
};

/* ── Color schemes ────────────────────────────────────────────────────── */
const POSITIVE_COLORS = {
  border: "border-emerald-200",
  bg: "bg-emerald-50/40",
  switchChecked: "data-[state=checked]:bg-emerald-600",
  iconBg: "bg-emerald-100",
  iconColor: "text-emerald-600",
  followUpBorderL: "border-l-emerald-400",
  followUpBg: "bg-emerald-50/30",
  followUpBorderT: "border-t-emerald-100",
  followUpLabel: "text-emerald-700",
};

const NEGATIVE_COLORS = {
  border: "border-red-200",
  bg: "bg-red-50/40",
  switchChecked: "data-[state=checked]:bg-red-500",
  iconBg: "bg-red-100",
  iconColor: "text-red-500",
  followUpBorderL: "border-l-red-300",
  followUpBg: "bg-red-50/30",
  followUpBorderT: "border-t-red-100",
  followUpLabel: "text-red-700",
};

export function FlagToggle({
  id,
  label,
  description,
  positive,
  checked,
  onCheckedChange,
  followUps,
  followUpValues = {},
  onFollowUpChange,
}: FlagToggleProps) {
  const colors = positive ? POSITIVE_COLORS : NEGATIVE_COLORS;

  return (
    <div
      className={`rounded-lg border transition-all duration-200 ${
        checked
          ? `${colors.border} ${colors.bg}`
          : "border-border hover:border-border/80 hover:bg-muted/20"
      }`}
    >
      {/* Header row: Icon · Label · Switch */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon circle */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
            checked
              ? `${colors.iconBg} ${colors.iconColor}`
              : "bg-muted text-muted-foreground"
          }`}
        >
          {FLAG_ICONS[id] ?? null}
        </div>

        {/* Label & description */}
        <div className="min-w-0 flex-1">
          <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
            {label}
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Switch (right-aligned) */}
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={`mt-0.5 shrink-0 ${checked ? colors.switchChecked : ""}`}
        />
      </div>

      {/* Follow-up questions (shown when toggled on) */}
      {checked && followUps && followUps.length > 0 && (
        <div
          className={`rounded-bl-lg border-l-2 border-t px-4 pb-4 pt-3 ${colors.followUpBorderL} ${colors.followUpBg} ${colors.followUpBorderT}`}
        >
          <p className={`mb-3 flex items-center gap-1 text-xs font-medium ${colors.followUpLabel}`}>
            <svg
              className="h-3.5 w-3.5"
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
            Help us understand more (optional)
          </p>

          <div className="space-y-3">
            {followUps.map((q) => (
              <div key={q.id}>
                <label className="mb-1 block text-xs font-medium">
                  {q.label}
                </label>
                {q.type === "select" && q.options ? (
                  <Select
                    value={followUpValues[q.id] ?? ""}
                    onValueChange={(v) => onFollowUpChange?.(q.id, v)}
                  >
                    <SelectTrigger className="h-9 bg-white text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {q.options.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-xs">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    className="h-9 bg-white text-xs"
                    placeholder={q.placeholder ?? ""}
                    value={followUpValues[q.id] ?? ""}
                    onChange={(e) =>
                      onFollowUpChange?.(q.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
