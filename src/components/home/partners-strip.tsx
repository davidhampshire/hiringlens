export function PartnersStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="animate-in-view-d3 text-center">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Trusted by candidates at leading companies
        </p>
        <div className="mt-5 flex items-center justify-center gap-8 sm:gap-12">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="flex h-8 w-24 items-center justify-center rounded bg-muted/40 sm:h-9 sm:w-28"
            >
              <span className="text-[10px] font-medium text-muted-foreground/40">
                Partner {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
