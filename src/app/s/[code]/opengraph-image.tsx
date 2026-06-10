import { ImageResponse } from "next/og";
import { decodeShare, DIMENSION_ORDER, DIMENSION_LABELS } from "@/lib/share";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PromptScore result";

function scoreColor(score: number): string {
  if (score >= 85) return "#34d399";
  if (score >= 70) return "#a3e635";
  if (score >= 55) return "#facc15";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const payload = decodeShare(code);
  const score = payload?.s ?? 0;
  const grade = payload?.g ?? "?";
  const roast = payload?.r ?? "How good is your prompt?";
  const color = scoreColor(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #09090f 0%, #161028 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
            <span>Prompt</span>
            <span style={{ color: "#8b5cf6" }}>Score</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 640,
            }}
          >
            <div style={{ display: "flex", fontSize: 30, color: "#ffffffaa" }}>
              My prompt scored
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 24,
              }}
            >
              <span style={{ fontSize: 160, fontWeight: 800, color }}>
                {score}
              </span>
              <span style={{ fontSize: 56, color: "#ffffff88" }}>/100</span>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color,
                  border: `4px solid ${color}`,
                  borderRadius: 20,
                  padding: "4px 24px",
                }}
              >
                {grade}
              </span>
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#ffffffcc" }}>
              &ldquo;{roast}&rdquo;
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8b5cf6" }}>
            Can you beat it? → llmutils.co
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 14,
            width: 360,
          }}
        >
          {DIMENSION_ORDER.map((k, i) => {
            const v = payload?.d[i] ?? 0;
            return (
              <div
                key={k}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 20,
                    color: "#ffffff99",
                  }}
                >
                  <span>{DIMENSION_LABELS[k]}</span>
                  <span>{v}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: 10,
                    background: "#26263a",
                    borderRadius: 5,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: `${v}%`,
                      height: 10,
                      background: scoreColor(v),
                      borderRadius: 5,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    size
  );
}
