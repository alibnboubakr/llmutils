// Share payloads encode only the scorecard (score, grade, dimension scores)
// — never the prompt text itself, so links are safe to post publicly.

import type { DimensionKey } from "./engine";

export interface SharePayload {
  v: 1;
  s: number; // score
  g: string; // grade letter
  p: number; // percentile
  r: string; // roast
  d: number[]; // 8 dimension scores, fixed order
}

export const DIMENSION_ORDER: DimensionKey[] = [
  "task",
  "specificity",
  "context",
  "format",
  "constraints",
  "clarity",
  "examples",
  "role",
];

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  task: "Task definition",
  specificity: "Specificity",
  context: "Context",
  format: "Output format",
  constraints: "Constraints",
  clarity: "Clarity",
  examples: "Examples",
  role: "Role / persona",
};

function toBase64Url(s: string): string {
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(s, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return typeof window === "undefined"
    ? Buffer.from(b64, "base64").toString("utf-8")
    : decodeURIComponent(escape(atob(b64)));
}

export function encodeShare(payload: SharePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeShare(code: string): SharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(code));
    if (
      parsed?.v !== 1 ||
      typeof parsed.s !== "number" ||
      typeof parsed.g !== "string" ||
      typeof parsed.p !== "number" ||
      typeof parsed.r !== "string" ||
      !Array.isArray(parsed.d) ||
      parsed.d.length !== 8 ||
      !parsed.d.every((n: unknown) => typeof n === "number")
    ) {
      return null;
    }
    return {
      v: 1,
      s: Math.max(0, Math.min(100, Math.round(parsed.s))),
      g: String(parsed.g).slice(0, 2),
      p: Math.max(1, Math.min(99, Math.round(parsed.p))),
      r: String(parsed.r).slice(0, 120),
      d: parsed.d.map((n: number) => Math.max(0, Math.min(100, Math.round(n)))),
    };
  } catch {
    return null;
  }
}
