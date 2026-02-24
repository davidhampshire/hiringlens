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
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  followUps?: readonly FollowUpQuestion[];
  followUpValues?: Record<string, string>;
  onFollowUpChange?: (questionId: string, value: string) => void;
}

export function FlagToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  followUps,
  followUpValues = {},
  onFollowUpChange,
}: FlagToggleProps) {
  return (
    <div
      className={`rounded-lg border transition-colors ${
        checked ? "border-primary/30 bg-primary/[0.02]" : ""
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-0.5"
        />
        <div className="flex-1">
          <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Conditional follow-up questions */}
      {checked && followUps && followUps.length > 0 && (
        <div className="border-t bg-muted/20 px-3 pb-3 pt-2.5">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Optional, help us understand more:
          </p>
          <div className="space-y-2.5">
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
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-xs">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    className="h-8 text-xs"
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
