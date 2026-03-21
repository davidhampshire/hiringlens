import Link from "next/link";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Reviews", href: "/recent" },
  { label: "Companies", href: "/companies" },
  { label: "Insights", href: "/insights" },
  { label: "Search", href: "/search" },
  { label: "Share Experience", href: "/submit" },
];

const FOR_COMPANIES_LINKS = [
  { label: "Represent Your Company", href: "/represent" },
  { label: "Advertisers", href: "/advertisers" },
  { label: "Contact Us", href: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "Help", href: "/help" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy & Ad Choices", href: "/privacy" },
  { label: "Cookie Consent", href: "/cookies" },
  { label: "My Information", href: "/my-information" },
];

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {/* Brand column — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  HL
                </span>
              </div>
              <span className="font-semibold tracking-tight">HiringLens</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Championing transparency in hiring. Spotlighting great companies,
              flagging the rest, and helping candidates support each other.
            </p>
            <a
              href="https://www.linkedin.com/company/hiring-lens/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="HiringLens on LinkedIn"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Follow us on LinkedIn
            </a>
          </div>

          <FooterSection title="Explore" links={EXPLORE_LINKS} />
          <FooterSection title="For Companies" links={FOR_COMPANIES_LINKS} />
          <FooterSection title="Resources" links={RESOURCE_LINKS} />
          <FooterSection title="Legal" links={LEGAL_LINKS} />
        </div>

        {/* Copyright bar */}
        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} Hiring Lens. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
