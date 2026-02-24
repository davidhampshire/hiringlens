import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <span className="text-xs font-bold text-primary-foreground">HL</span>
          </div>
          <span className="text-sm text-muted-foreground">
            HiringLens &copy; {new Date().getFullYear()}
          </span>
        </div>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/submit"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Submit
          </Link>
          <Link
            href="/search"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Search
          </Link>
        </nav>
      </div>
    </footer>
  );
}
