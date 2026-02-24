import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "HiringLens community guidelines. Learn what makes a good review and what content is not allowed.",
};

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Community Guidelines</h1>
        <p className="mt-2 text-muted-foreground">
          HiringLens exists to help candidates share honest, constructive
          feedback about interview experiences. These guidelines ensure a fair
          and useful platform for everyone.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-emerald-600">
            What makes a great review
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-emerald-600">&#10003;</span>
              <span>
                <strong className="text-foreground">Be specific</strong> &mdash;
                Describe the stages, timing, and format of the process. The more
                detail, the more useful it is.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">&#10003;</span>
              <span>
                <strong className="text-foreground">Be honest</strong> &mdash;
                Share your genuine experience, whether positive or negative.
                Balanced reviews are the most helpful.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">&#10003;</span>
              <span>
                <strong className="text-foreground">Be constructive</strong>{" "}
                &mdash; Focus on the process, not personal grudges. Explain what
                went well and what could be improved.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">&#10003;</span>
              <span>
                <strong className="text-foreground">Share tips</strong> &mdash;
                Help future candidates prepare. What would you tell a friend
                before their interview?
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-red-600">
            What is not allowed
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-red-600">&#10007;</span>
              <span>
                <strong className="text-foreground">
                  Personal attacks on individuals
                </strong>{" "}
                &mdash; Do not name or identify specific interviewers in a
                negative context. Focus on the process, not the person.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">&#10007;</span>
              <span>
                <strong className="text-foreground">
                  Inappropriate language
                </strong>{" "}
                &mdash; Profanity, slurs, or offensive language will result in
                your review being rejected.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">&#10007;</span>
              <span>
                <strong className="text-foreground">
                  Confidential information
                </strong>{" "}
                &mdash; Do not share proprietary interview questions, NDA-protected
                content, trade secrets, or confidential business information.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">&#10007;</span>
              <span>
                <strong className="text-foreground">Fake reviews</strong>{" "}
                &mdash; Only submit reviews for interviews you have actually
                experienced. Fabricated reviews undermine trust.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">&#10007;</span>
              <span>
                <strong className="text-foreground">
                  Spam or promotional content
                </strong>{" "}
                &mdash; Reviews must be genuine experiences, not advertisements
                or promotional material.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Moderation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All submissions are reviewed before publishing. Reviews that violate
            these guidelines will be rejected. Repeated violations may result in
            submissions being deprioritised. If you see a review that violates
            these guidelines, please use the &quot;Report&quot; button to flag
            it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Questions?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If you&apos;re unsure whether your review meets these guidelines,
            err on the side of being constructive and factual. If you have
            questions, contact us at{" "}
            <a
              href="mailto:support@hiringlens.com"
              className="text-primary hover:underline"
            >
              support@hiringlens.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
