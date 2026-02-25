"use client";

import { cn } from "@/lib/utils";

const LETTERS = [
  "#",
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
];

interface LetterNavProps {
  availableLetters: Set<string>;
  activeLetter?: string;
}

export function LetterNav({ availableLetters, activeLetter }: LetterNavProps) {
  function scrollToLetter(letter: string) {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      const headerOffset = 140; // header + letter nav
      const top =
        el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <div className="sticky top-16 z-30 -mx-4 border-b px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap gap-1">
        {LETTERS.map((letter) => {
          const isAvailable = availableLetters.has(letter);
          return (
            <button
              key={letter}
              onClick={() => isAvailable && scrollToLetter(letter)}
              disabled={!isAvailable}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors",
                isAvailable
                  ? activeLetter === letter
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                  : "cursor-default text-muted-foreground/40"
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
