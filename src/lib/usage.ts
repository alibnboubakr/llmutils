export const FREE_DAILY_LIMIT = 5;

// Canonical list of tools that count toward daily limits.
export const TRACKED_TOOLS = [
  "markdown",
  "sanitize",
  "un-sanitizer",
  "json",
  "json-formatter",
  "csv-to-json",
  "regex",
  "diff",
  "markdown-preview",
  "html-to-jsx",
  "code-minifier",
  "chat-exporter",
  "token-estimator",
  "image-ocr",
  "transcribe",
] as const;

export type TrackedTool = (typeof TRACKED_TOOLS)[number];

export type UsageRow = {
  tool: string;
  count: number;
};
