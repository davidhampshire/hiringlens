interface CandidateTipsProps {
  tips: string[];
}

export function CandidateTips({ tips }: CandidateTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium">Candidate Tips</h3>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="relative ml-3">
            {/* Speech bubble tail — rotated square, same bg/border as bubble */}
            <div className="absolute -left-[9px] top-[14px] h-[18px] w-[18px] rotate-45 border-b border-l border-primary/20 bg-primary/[0.05]" />
            {/* Bubble body */}
            <div className="relative rounded-2xl border border-primary/20 bg-primary/[0.05] px-4 py-3.5 text-sm text-foreground/75">
              &ldquo;{tip}&rdquo;
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
