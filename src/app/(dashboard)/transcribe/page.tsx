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
import { Copy, Loader2, Youtube } from "lucide-react";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

type Segment = { text: string; offset: number; duration: number };

export default function TranscribePage() {
  const [url, setUrl] = React.useState("");
  const [transcript, setTranscript] = React.useState("");
  const [segments, setSegments] = React.useState<Segment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"plain" | "timestamped">("plain");

  async function onFetch() {
    if (!url) return;
    setLoading(true);
    setError(null);
    setTranscript("");
    setSegments([]);
    try {
      const res = await fetch("/api/tools/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch transcript");
      setTranscript(data.transcript ?? "");
      setSegments(data.segments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch transcript");
    } finally {
      setLoading(false);
    }
  }

  const timestampedText = React.useMemo(
    () =>
      segments
        .map((s) => `[${formatTime(s.offset)}] ${s.text}`)
        .join("\n"),
    [segments]
  );

  const displayText = view === "plain" ? transcript : timestampedText;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Youtube className="h-8 w-8 text-primary" />
          YouTube Transcribe
        </h1>
        <p className="text-muted-foreground mt-2">
          Paste a YouTube link to grab the auto-generated transcript.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Video URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) onFetch();
              }}
            />
            <Button onClick={onFetch} disabled={!url || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Fetching…
                </>
              ) : (
                "Fetch transcript"
              )}
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {transcript && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transcript</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={view === "plain" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("plain")}
              >
                Plain
              </Button>
              <Button
                variant={view === "timestamped" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("timestamped")}
                disabled={segments.length === 0}
              >
                With timestamps
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(displayText)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto max-h-[500px]">
              {displayText}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 fetches/day</Badge>
        <span>
          Transcripts are pulled from YouTube&apos;s captions when available.
        </span>
      </div>
    </div>
  );
}
