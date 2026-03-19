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

  // ExperienceForm renders as a full-screen fixed overlay — no page chrome needed
  return <ExperienceForm prefilledCompany={company} />;
}
