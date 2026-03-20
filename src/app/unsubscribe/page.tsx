import type { Metadata } from "next";
import Link from "next/link";
import { unsubscribeByToken } from "@/lib/actions/watch";

export const metadata: Metadata = {
  title: "Unsubscribe | HiringLens",
  robots: { index: false },
};

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <UnsubscribeLayout success={false} message="Invalid unsubscribe link. No token provided." />;
  }

  const result = await unsubscribeByToken(token);

  if (!result.success) {
    return <UnsubscribeLayout success={false} message={result.error ?? "Could not process your request."} />;
  }

  return (
    <UnsubscribeLayout
      success={true}
      message="You've been unsubscribed and won't receive any more alerts for this company."
    />
  );
}

function UnsubscribeLayout({ success, message }: { success: boolean; message: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
          success ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-muted"
        }`}
      >
        {success ? "✓" : "✕"}
      </div>
      <h1 className="text-xl font-semibold">
        {success ? "Unsubscribed" : "Something went wrong"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to HiringLens
      </Link>
    </div>
  );
}
