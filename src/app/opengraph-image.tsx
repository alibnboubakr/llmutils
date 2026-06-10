import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PromptScore — How good is your prompt?";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #09090f 0%, #161028 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 70,
        }}
      >
        <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
          <span>Prompt</span>
          <span style={{ color: "#8b5cf6" }}>Score</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            How good is your prompt?
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#ffffff99", maxWidth: 900 }}>
            Get a 0-100 score, a roast, and a rebuilt version of your prompt —
            instantly. Free, no signup.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 28, color: "#8b5cf6" }}>llmutils.co</span>
          <span
            style={{
              fontSize: 28,
              color: "#34d399",
              border: "3px solid #34d39966",
              borderRadius: 16,
              padding: "8px 28px",
            }}
          >
            Most prompts score under 50. What&apos;s yours?
          </span>
        </div>
      </div>
    ),
    size
  );
}
