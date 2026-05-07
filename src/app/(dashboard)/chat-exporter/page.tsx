"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  FileJson,
  Presentation,
  Loader2,
} from "lucide-react";
import { useTrackUsage } from "@/lib/use-track-usage";

type ExportFormat = "markdown" | "pdf" | "notion" | "slides";

const SAMPLE_CHAT = [
  "User: How do I implement authentication in Next.js?",
  "",
  "Assistant: A few common options:",
  "",
  "1. NextAuth.js — drop-in OAuth providers and sessions.",
  "2. Supabase Auth — email/password, OAuth, magic links, with Postgres + RLS.",
  "3. Custom JWT — roll your own with httpOnly cookies.",
  "",
  "User: Tell me more about Supabase Auth.",
  "",
  "Assistant: Sure — install @supabase/supabase-js, create a client with",
  "your URL and anon key, and use signUp / signInWithPassword / signInWithOAuth.",
  "Combine it with Row Level Security so your database trusts the JWT directly.",
].join("\n");

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportPdf(text: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const lineHeight = 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, usableWidth);
  let y = margin;
  for (const line of lines) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save("chat-export.pdf");
}

export default function ChatExporterPage() {
  const trackUsage = useTrackUsage("chat-exporter");
  const [chatText, setChatText] = React.useState(SAMPLE_CHAT);
  const [format, setFormat] = React.useState<ExportFormat>("markdown");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isComingSoon = format === "notion" || format === "slides";

  async function handleExport() {
    if (!chatText || isComingSoon) return;
    setBusy(true);
    setError(null);
    try {
      if (format === "markdown") {
        downloadBlob(
          new Blob([chatText], { type: "text/markdown" }),
          "chat-export.md"
        );
      } else if (format === "pdf") {
        await exportPdf(chatText);
      }
      setDone(true);
      setTimeout(() => setDone(false), 2500);
      void trackUsage();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Chat Exporter</h1>
        <p className="text-muted-foreground mt-2">
          Save ChatGPT or Claude transcripts as Markdown or PDF.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat content</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="w-full min-h-[400px] bg-muted p-4 rounded-md text-sm font-mono resize-y"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Format</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={format === "markdown" ? "default" : "outline"}
                    onClick={() => setFormat("markdown")}
                    className="justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Markdown
                  </Button>
                  <Button
                    variant={format === "pdf" ? "default" : "outline"}
                    onClick={() => setFormat("pdf")}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFormat("notion")}
                    className="justify-start relative"
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    Notion
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                      Soon
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFormat("slides")}
                    className="justify-start relative"
                  >
                    <Presentation className="h-4 w-4 mr-2" />
                    Slides
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                      Soon
                    </span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground">
                {format === "markdown" &&
                  "Saves as .md, preserving code blocks and structure."}
                {format === "pdf" &&
                  "Generates a paginated PDF with monospaced text."}
                {format === "notion" &&
                  "Coming soon. Will create a new Notion page via the Notion API once OAuth is wired up."}
                {format === "slides" &&
                  "Coming soon. Will convert the chat into a Google Slides deck once OAuth is wired up."}
              </div>

              <Button
                onClick={handleExport}
                disabled={!chatText || busy || isComingSoon}
                className="w-full"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Exporting…
                  </>
                ) : done ? (
                  "Exported!"
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {isComingSoon
                      ? "Not available yet"
                      : `Export as ${format.charAt(0).toUpperCase()}${format.slice(1)}`}
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 exports/day</Badge>
        <span>Upgrade to Pro for unlimited exports.</span>
      </div>
    </div>
  );
}
