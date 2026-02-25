import { ImageResponse } from "next/og";

export const alt = "HiringLens - See How Companies Really Hire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          padding: "80px",
          justifyContent: "center",
        }}
      >
        {/* Main branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#18181b",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            HiringLens
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#71717a",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            See How Companies Really Hire
          </div>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {[
            "Reality Scores",
            "Interview Timelines",
            "Red Flag Alerts",
            "Candidate Tips",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                fontSize: 18,
                color: "#18181b",
                backgroundColor: "#f4f4f5",
                padding: "10px 24px",
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #f4f4f5",
            paddingTop: "24px",
            marginTop: "auto",
          }}
        >
          <div style={{ fontSize: 18, color: "#a1a1aa" }}>
            hiringlens.vercel.app
          </div>
          <div style={{ fontSize: 18, color: "#a1a1aa" }}>
            Real interview experiences from real candidates
          </div>
        </div>
      </div>
    ),
    size
  );
}
