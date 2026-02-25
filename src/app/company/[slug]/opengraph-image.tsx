import { ImageResponse } from "next/og";
import { createStaticClient } from "@/lib/supabase/static";
import type { CompanyScore } from "@/types";

export const alt = "Company Reality Score";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getScoreHex(score: number | null): string {
  if (score === null) return "#9ca3af";
  if (score >= 70) return "#059669";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}

function getScoreBgHex(score: number | null): string {
  if (score === null) return "#f3f4f6";
  if (score >= 70) return "#ecfdf5";
  if (score >= 40) return "#fffbeb";
  return "#fef2f2";
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data } = await supabase
    .from("company_scores")
    .select("*")
    .eq("slug", slug)
    .single();

  const company = data as CompanyScore | null;

  if (!company) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700, color: "#18181b" }}>
            HiringLens
          </div>
        </div>
      ),
      size
    );
  }

  const score = company.reality_score;
  const scoreText = score !== null ? Math.round(score).toString() : "N/A";
  const scoreColor = getScoreHex(score);
  const scoreBg = getScoreBgHex(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: "60px 80px",
        }}
      >
        {/* Top: branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#18181b",
              letterSpacing: "-0.5px",
            }}
          >
            HiringLens
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#71717a",
              borderLeft: "2px solid #e4e4e7",
              paddingLeft: "12px",
            }}
          >
            See How Companies Really Hire
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          {/* Company info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "700px" }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: "#18181b", lineHeight: 1.1 }}>
              {company.name}
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {company.industry && (
                <div
                  style={{
                    fontSize: 20,
                    color: "#71717a",
                    backgroundColor: "#f4f4f5",
                    padding: "6px 16px",
                    borderRadius: "8px",
                  }}
                >
                  {company.industry}
                </div>
              )}
              {company.location && (
                <div style={{ fontSize: 20, color: "#71717a" }}>
                  {company.location}
                </div>
              )}
            </div>
            <div style={{ fontSize: 20, color: "#a1a1aa", marginTop: "8px" }}>
              {company.total_reviews}{" "}
              {company.total_reviews === 1 ? "interview review" : "interview reviews"}
            </div>
          </div>

          {/* Score badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "200px",
              height: "200px",
              borderRadius: "24px",
              backgroundColor: scoreBg,
              border: `3px solid ${scoreColor}20`,
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {scoreText}
            </div>
            <div
              style={{
                fontSize: 16,
                color: scoreColor,
                marginTop: "8px",
                fontWeight: 600,
              }}
            >
              Reality Score
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #f4f4f5",
            paddingTop: "20px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontSize: 16, color: "#a1a1aa" }}>
            hiringlens.vercel.app/company/{slug}
          </div>
          <div style={{ fontSize: 16, color: "#a1a1aa" }}>
            Real interview experiences from real candidates
          </div>
        </div>
      </div>
    ),
    size
  );
}
