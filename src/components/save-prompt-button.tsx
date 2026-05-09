"use client";

import * as React from "react";
import { BookMarked, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SavePromptButtonProps {
  content: string;
  tool: string;
  disabled?: boolean;
}

export function SavePromptButton({ content, tool, disabled }: SavePromptButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setSaved(false);
      setError(null);
    }
  }, [open]);

  async function onSave() {
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || `${tool} prompt`,
          content,
          tool,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setOpen(false), 900);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || !content}
          title="Save to Prompt Library"
        >
          <BookMarked className="h-4 w-4 mr-2" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Prompt Library</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !saving) onSave(); }}
            autoFocus
          />
          <div className="rounded-md bg-muted p-3 max-h-40 overflow-auto text-sm font-mono text-muted-foreground">
            {content.length > 400 ? content.slice(0, 400) + "…" : content}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={onSave} disabled={saving || saved} className="w-full">
            {saved ? (
              <><Check className="h-4 w-4 mr-2" /> Saved!</>
            ) : saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</>
            ) : (
              "Save prompt"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
