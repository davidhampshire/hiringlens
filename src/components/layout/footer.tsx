import Link from "next/link";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Recent Posts", href: "/recent" },
  { label: "Companies", href: "/companies" },
  { label: "Search", href: "/search" },
  { label: "Share Experience", href: "/submit" },
];

const RESOURCE_LINKS = [
  { label: "Help", href: "/help" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Advertisers", href: "/advertisers" },
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
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  HL
                </span>
              </div>
              <span className="font-semibold tracking-tight">HiringLens</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              See how companies really hire. Real interview experiences from real
              candidates.
            </p>
          </div>

          <FooterSection title="Explore" links={EXPLORE_LINKS} />
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
