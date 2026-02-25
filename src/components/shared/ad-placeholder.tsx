import { cn } from "@/lib/utils";

type AdVariant = "leaderboard" | "banner" | "sidebar";

interface AdPlaceholderProps {
  variant?: AdVariant;
  className?: string;
}

const VARIANTS: Record<AdVariant, { height: string; label: string }> = {
  leaderboard: { height: "h-[90px]", label: "728 × 90" },
  banner: { height: "h-[250px]", label: "728 × 250" },
  sidebar: { height: "h-[250px]", label: "280 × 250" },
};

export function AdPlaceholder({ variant = "leaderboard", className }: AdPlaceholderProps) {
  const v = VARIANTS[variant];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/15 bg-muted/20",
        v.height,
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
        <span className="text-xs font-medium">Ad Space</span>
        <span className="text-[10px]">{v.label}</span>
      </div>
    </div>
  );
}
