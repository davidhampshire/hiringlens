import Link from "next/link";
import { Building2 } from "lucide-react";

interface CompanyRepCtaProps {
  companyName: string;
}

export function CompanyRepCta({ companyName }: CompanyRepCtaProps) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
      <div className="mb-2 flex items-center gap-2">
        <Building2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
          Do you work at {companyName}?
        </p>
      </div>
      <p className="mb-3 text-xs text-blue-700/80 dark:text-blue-300/70">
        Verified representatives can respond to candidate reviews and build a
        transparent employer brand.
      </p>
      <Link
        href="/represent"
        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Represent {companyName} →
      </Link>
    </div>
  );
}
