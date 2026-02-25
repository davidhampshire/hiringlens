import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Check Your Email",
  robots: { index: false },
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Card>
        <CardHeader className="pb-0" />
        <CardContent>
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="h-7 w-7 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent a confirmation link
              {email ? (
                <>
                  {" "}to <strong className="text-foreground">{email}</strong>
                </>
              ) : (
                ""
              )}
              . Click it to activate your account, then you can start sharing
              your experiences.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Didn&apos;t receive it? Check your spam folder.
            </p>
            <Link
              href="/sign-in"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
