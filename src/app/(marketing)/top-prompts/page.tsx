import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, ArrowRight, Sparkles } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Top Community Prompts | LLMUtils",
  description:
    "The best prompts shared by the LLMUtils community — ready to copy and use with ChatGPT, Claude, and Gemini.",
};

export const revalidate = 300;

type Prompt = {
  id: string;
  title: string;
  content: string;
  tool: string | null;
  tags: string[];
  created_at: string;
};

async function getPublicPrompts(): Promise<Prompt[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("saved_prompts")
      .select("id, title, content, tool, tags, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data as Prompt[]) ?? [];
  } catch {
    return [];
  }
}

export default async function TopPromptsPage() {
  const prompts = await getPublicPrompts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          Community Picks
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Top Prompts This Week
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Battle-tested prompts shared by the LLMUtils community.
          Copy any prompt, paste it into your AI tool of choice.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/signup">
            <Button>
              Save your own prompts free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {prompts.length === 0 ? (
        <Card className="border-dashed text-center">
          <CardContent className="py-14">
            <BookMarked className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No public prompts yet. Be the first to share!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="group hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{prompt.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {prompt.tool && (
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {prompt.tool.replace(/-/g, " ")}
                      </Badge>
                    )}
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 p-3 rounded-md overflow-auto max-h-40 leading-relaxed">
                  {prompt.content.length > 400
                    ? prompt.content.slice(0, 400) + "…"
                    : prompt.content}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Want to add yours to the list?
        </p>
        <Link href="/signup">
          <Button variant="outline">
            Create a free account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
