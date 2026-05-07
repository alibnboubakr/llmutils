import { NextResponse } from "next/server";
import { getTodayUsage } from "@/lib/usage-server";
import { FREE_DAILY_LIMIT } from "@/lib/usage";

export const runtime = "nodejs";

export async function GET() {
  const { rows, plan } = await getTodayUsage();
  return NextResponse.json({
    plan,
    limit: plan === "pro" ? null : FREE_DAILY_LIMIT,
    usage: rows,
  });
}
