interface CandidateTipsProps {
  tips: string[];
}

export function CandidateTips({ tips }: CandidateTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Candidate Tips</h3>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li
            key={i}
            className="rounded-lg border bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
          >
            &ldquo;{tip}&rdquo;
          </li>
        ))}
      </ul>
    </div>
  );
}
