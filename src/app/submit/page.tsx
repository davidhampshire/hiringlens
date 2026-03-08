import type { Metadata } from "next";
import { ExperienceForm } from "@/components/submit/experience-form";
import { PartnersStrip } from "@/components/home/partners-strip";

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="animate-in-view mb-8 mt-10 lg:mt-0">
        <h1 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">Share Your <span className="text-foreground/25">Experience</span></h1>
        <p className="mt-2 text-muted-foreground">
          Help other candidates prepare by sharing honest feedback about the
          interview process. Your submission will be reviewed before publishing.
        </p>
      </div>

      <div>
        <ExperienceForm prefilledCompany={company} />
      </div>

      <PartnersStrip />
    </div>
  );
}
