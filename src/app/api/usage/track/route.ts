import { NextRequest, NextResponse } from "next/server";
import { trackUsage } from "@/lib/usage-server";
import { TRACKED_TOOLS } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tool =
    typeof body === "object" && body !== null && "tool" in body
      ? (body as { tool: unknown }).tool
      : null;

  if (typeof tool !== "string" || !TRACKED_TOOLS.includes(tool as never)) {
    return NextResponse.json(
      { error: "Unknown tool" },
      { status: 400 }
    );
  }

  const result = await trackUsage(tool);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    count: result.count,
    limit: result.limit,
    plan: result.plan,
  });
}
