import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "HiringLens community guidelines. Learn what makes a good review and what content is not allowed.",
};

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-medium leading-tight sm:text-5xl">
          Community <span className="text-foreground/25">Guidelines</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          HiringLens exists to help candidates share honest, constructive
          feedback about interview experiences. These guidelines ensure a fair
          and useful platform for everyone.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-medium">Our Honesty Standard</h2>
          <p className="mt-3 text-muted-foreground">
            Every review on HiringLens represents someone&apos;s real experience.
            When you submit, you&apos;re confirming that your review is truthful,
            first-hand, and based on genuine interactions with the company.
          </p>
          <p className="mt-3 text-muted-foreground">
            You don&apos;t need to be perfect — you can share frustrations,
            criticism, and nuance freely. What we ask is that you don&apos;t
            knowingly post false information, impersonate others, or review
            companies you haven&apos;t genuinely dealt with.
          </p>
          <p className="mt-3 text-muted-foreground">
            Reviews found to violate this standard may be removed. If you believe
            a review about your company contains false statements of fact, you can
            submit a content review request via our{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact page
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium text-emerald-600">
            What makes a great review
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-0.5 text-emerald-600">&#10003;</span>
              <span>
                <strong className="font-medium text-foreground">Be specific.</strong>{" "}
                Describe the stages, timing, and format of the process. The more
                detail, the more useful it is.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-emerald-600">&#10003;</span>
              <span>
                <strong className="font-medium text-foreground">Be honest.</strong>{" "}
                Share your genuine experience, whether positive or negative.
                Balanced reviews are the most helpful.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-emerald-600">&#10003;</span>
              <span>
                <strong className="font-medium text-foreground">Be constructive.</strong>{" "}
                Focus on the process, not personal grudges. Explain what
                went well and what could be improved.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-emerald-600">&#10003;</span>
              <span>
                <strong className="font-medium text-foreground">Share tips.</strong>{" "}
                Help future candidates prepare. What would you tell a friend
                before their interview?
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-medium text-red-600">
            What is not allowed
          </h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-0.5 text-red-600">&#10007;</span>
              <span>
                <strong className="font-medium text-foreground">
                  Personal attacks on individuals.
                </strong>{" "}
                Do not name or identify specific interviewers in a
                negative context. Focus on the process, not the person.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-red-600">&#10007;</span>
              <span>
                <strong className="font-medium text-foreground">
                  Inappropriate language.
                </strong>{" "}
                Profanity, slurs, or offensive language will result in
                your review being rejected.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-red-600">&#10007;</span>
              <span>
                <strong className="font-medium text-foreground">
                  Confidential information.
                </strong>{" "}
                Do not share proprietary interview questions, NDA-protected
                content, trade secrets, or confidential business information.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-red-600">&#10007;</span>
              <span>
                <strong className="font-medium text-foreground">Fake reviews.</strong>{" "}
                Only submit reviews for interviews you have actually
                experienced. Fabricated reviews undermine trust.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-red-600">&#10007;</span>
              <span>
                <strong className="font-medium text-foreground">
                  Spam or promotional content.
                </strong>{" "}
                Reviews must be genuine experiences, not advertisements
                or promotional material.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-medium">Moderation</h2>
          <p className="mt-3 text-muted-foreground">
            All submissions are reviewed before publishing. Reviews that violate
            these guidelines will be rejected. Repeated violations may result in
            submissions being deprioritised. If you see a review that violates
            these guidelines, please use the &quot;Report&quot; button to flag
            it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium">Questions?</h2>
          <p className="mt-3 text-muted-foreground">
            If you&apos;re unsure whether your review meets these guidelines,
            err on the side of being constructive and factual. If you have
            questions, contact us at{" "}
            <a
              href="mailto:hiringlensofficial@gmail.com"
              className="text-primary hover:underline"
            >
              hiringlensofficial@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
