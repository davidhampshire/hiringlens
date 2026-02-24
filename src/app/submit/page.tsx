import type { Metadata } from "next";
import { ExperienceForm } from "@/components/submit/experience-form";

export const metadata: Metadata = {
  title: "Share Your Interview Experience",
  description:
    "Help other candidates by sharing your interview experience. Rate the process, highlight red flags, and provide tips.",
  robots: { index: false },
};

interface SubmitPageProps {
  searchParams: Promise<{ company?: string }>;
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const { company } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Share Your Experience</h1>
        <p className="mt-2 text-muted-foreground">
          Help other candidates prepare by sharing honest feedback about the
          interview process. Your submission will be reviewed before publishing.
        </p>
      </div>

      <ExperienceForm prefilledCompany={company} />
    </div>
  );
}
