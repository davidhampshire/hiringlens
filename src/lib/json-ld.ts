import type { CompanyScore, Interview } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.vercel.app";

/**
 * Sanitise a string for safe embedding inside a <script type="application/ld+json"> tag.
 * Prevents XSS via closing script tags or HTML entities in user-generated content.
 */
function sanitizeJsonLdString(str: string): string {
  return str
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026");
}

export function buildHomepageJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "HiringLens",
      url: SITE_URL,
      description:
        "Real interview experiences from real candidates. See how companies really hire with Reality Scores, interview timelines, and red flag alerts.",
      logo: `${SITE_URL}/icon.png`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "HiringLens",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function buildCompanyJsonLd(
  company: CompanyScore,
  interviews: Interview[],
  slug: string
) {
  const companyUrl = `${SITE_URL}/company/${slug}`;

  // Convert reality score (0-100) to 1-5 scale
  const ratingValue = company.reality_score
    ? Math.round((company.reality_score / 20) * 10) / 10
    : null;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: sanitizeJsonLdString(company.name),
    url: companyUrl,
  };

  if (company.industry) {
    jsonLd.description = `${sanitizeJsonLdString(company.name)} interview experiences in ${sanitizeJsonLdString(company.industry)}`;
  }

  if (ratingValue && company.total_reviews > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: company.total_reviews,
    };
  }

  // Add up to 5 reviews
  const reviewItems = interviews.slice(0, 5).map((interview) => {
    const avgRating =
      (interview.professionalism_rating +
        interview.communication_rating +
        interview.clarity_rating +
        interview.fairness_rating) /
      4;

    const review: Record<string, unknown> = {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: interview.display_name
          ? sanitizeJsonLdString(interview.display_name)
          : "Anonymous Candidate",
      },
      datePublished: interview.created_at.split("T")[0],
      reviewRating: {
        "@type": "Rating",
        ratingValue: avgRating.toFixed(1),
        bestRating: "5",
        worstRating: "1",
      },
      name: `${sanitizeJsonLdString(interview.role_title)} Interview`,
    };

    if (interview.candidate_tip) {
      review.reviewBody = sanitizeJsonLdString(interview.candidate_tip);
    }

    return review;
  });

  if (reviewItems.length > 0) {
    jsonLd.review = reviewItems;
  }

  return jsonLd;
}
