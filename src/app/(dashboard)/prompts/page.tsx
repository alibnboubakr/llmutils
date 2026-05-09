"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  Copy,
  Trash2,
  Search,
  Check,
  Loader2,
} from "lucide-react";

type SavedPrompt = {
  id: string;
  title: string;
  content: string;
  tool: string | null;
  tags: string[];
  is_public: boolean;
  created_at: string;
};

export default function PromptsPage() {
  const [prompts, setPrompts] = React.useState<SavedPrompt[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/prompts")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load")))
      .then((data: { prompts: SavedPrompt[] }) => setPrompts(data.prompts))
      .catch(() => setError("Failed to load prompts."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete prompt.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleCopy(prompt: SavedPrompt) {
    navigator.clipboard.writeText(prompt.content);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const filtered = React.useMemo(() => {
    if (!search.trim()) return prompts;
    const q = search.toLowerCase();
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.tool ?? "").toLowerCase().includes(q)
    );
  }, [prompts, search]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookMarked className="h-7 w-7 text-primary" />
            Prompt Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Your saved prompts from every tool. Copy and reuse in seconds.
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 mt-1">
          {prompts.length} saved
        </Badge>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : error ? (
        <p className="text-destructive text-sm py-8 text-center">{error}</p>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center">
            <BookMarked className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {search
                ? "No prompts match your search."
                : "No prompts saved yet. Use the Save button on any tool to add one."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((prompt) => (
            <Card key={prompt.id} className="group">
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{prompt.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {prompt.tool && (
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {prompt.tool.replace(/-/g, " ")}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(prompt.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(prompt)}
                    title="Copy to clipboard"
                  >
                    {copiedId === prompt.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => handleDelete(prompt.id)}
                    disabled={deletingId === prompt.id}
                    title="Delete"
                  >
                    {deletingId === prompt.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 p-3 rounded-md overflow-auto max-h-40 leading-relaxed">
                  {prompt.content.length > 500
                    ? prompt.content.slice(0, 500) + "…"
                    : prompt.content}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
