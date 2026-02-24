import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Help Centre",
  description:
    "Frequently asked questions about HiringLens. Learn how to submit reviews, understand Reality Scores, and get the most out of the platform.",
};

const FAQ_ITEMS = [
  {
    question: "How do I submit an interview experience?",
    answer:
      'Click "Share Experience" in the navigation bar. You\'ll be guided through a 7-step form covering company details, your role, the interview process, ratings, red flags, and tips for other candidates. All submissions are anonymous.',
  },
  {
    question: "How long until my review appears?",
    answer:
      "Every submission is reviewed before publishing to ensure quality and prevent abuse. This typically takes 1-3 business days. You'll see a confirmation message after submitting.",
  },
  {
    question: "How is the Reality Score calculated?",
    answer:
      "The Reality Score (0-100) is based on the average of four rating categories (professionalism, communication, clarity, fairness), scaled to 100, with penalties applied for red flags like ghosting (-15%), unpaid tasks (-10%), exceeded timelines (-10%), and no feedback (-5%).",
  },
  {
    question: "Is my review anonymous?",
    answer:
      "Yes. We do not require an account to submit a review, and no personally identifiable information is collected or displayed alongside your submission.",
  },
  {
    question: "Can I edit or delete my review after submitting?",
    answer:
      "Currently, reviews cannot be edited after submission. If you need to make a correction or request removal, please contact us at support@hiringlens.com.",
  },
  {
    question: "What are red flags?",
    answer:
      "Red flags are common negative patterns in interview processes: ghosting (company stops responding), unpaid work tasks, interviewers being late or unprepared, exceeding stated timelines, and failing to provide feedback. These affect a company's Reality Score.",
  },
  {
    question: "How do I report an inappropriate review?",
    answer:
      'Every review card has a "Report" button. Click it and select the reason for your report. Our team will review flagged content promptly.',
  },
  {
    question: "Can companies respond to reviews?",
    answer:
      "Company response functionality is on our roadmap and coming soon. We believe in giving employers the opportunity to address feedback constructively.",
  },
  {
    question: "I can't find my company. What do I do?",
    answer:
      "When submitting a review, simply type the company name. If it doesn't exist in our database yet, it will be created automatically when you submit your experience.",
  },
  {
    question: "Is HiringLens free?",
    answer:
      "Yes. HiringLens is completely free for candidates to use, both for reading reviews and submitting experiences.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Help Centre</h1>
        <p className="mt-2 text-muted-foreground">
          Frequently asked questions about using HiringLens.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <Card key={item.question} className="gap-0 p-5">
            <h3 className="font-medium">{item.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-muted/30 p-6 text-center">
        <h2 className="font-semibold">Still have questions?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact us at{" "}
          <a
            href="mailto:support@hiringlens.com"
            className="text-primary hover:underline"
          >
            support@hiringlens.com
          </a>
        </p>
      </div>
    </div>
  );
}
