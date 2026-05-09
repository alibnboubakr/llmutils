import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("saved_prompts")
    .select("id, title, content, tool, tags, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { prompts: data ?? [] },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
