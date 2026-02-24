"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function RatingInput({ label, value, onChange, error }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex gap-1" onMouseLeave={() => setHoverValue(0)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoverValue || value);
          return (
            <button
              key={star}
              type="button"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-md transition-colors",
                filled ? "text-amber-400" : "text-muted-foreground/30",
                "hover:scale-110"
              )}
              onMouseEnter={() => setHoverValue(star)}
              onClick={() => onChange(star)}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
