import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_prompts")
    .select("id, title, content, tool, tags, is_public, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prompts: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("saved_prompts")
    .insert({
      user_id: user.id,
      title: (body.title as string | undefined)?.trim() || "Untitled prompt",
      content: (body.content as string).trim(),
      tool: (body.tool as string | undefined) ?? null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      is_public: body.is_public === true,
    })
    .select("id, title, content, tool, tags, is_public, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prompt: data }, { status: 201 });
}
