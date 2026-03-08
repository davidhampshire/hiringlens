export function PartnersStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Trusted by candidates at leading companies
        </p>
        <div className="mt-5 flex items-center justify-center gap-6 sm:gap-10">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="flex h-10 w-28 items-center justify-center rounded-md bg-muted/40 sm:h-12 sm:w-36"
            >
              <span className="text-[11px] font-medium text-muted-foreground/40">
                Partner {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
