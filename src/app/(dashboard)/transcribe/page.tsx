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
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Copy, Loader2, Youtube } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Format milliseconds as HH:MM:SS,mmm (SRT) or HH:MM:SS.mmm (VTT) */
function formatTimecode(ms: number, separator: "," | "."): string {
  const totalMs = Math.floor(ms);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1_000);
  const millis = totalMs % 1_000;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    separator +
    String(millis).padStart(3, "0")
  );
}

const FILLER_WORDS_RE =
  /\b(uh|um|you know|like|er)\b[,.]?\s*/gi;

type Segment = { text: string; offset: number; duration: number };
type ExportFormat = "plain" | "timestamped" | "srt" | "vtt";

function buildSrt(segments: Segment[]): string {
  return segments
    .map((s, i) => {
      const start = formatTimecode(s.offset, ",");
      const end = formatTimecode(s.offset + s.duration, ",");
      return `${i + 1}\n${start} --> ${end}\n${s.text.trim()}\n`;
    })
    .join("\n");
}

function buildVtt(segments: Segment[]): string {
  const body = segments
    .map((s) => {
      const start = formatTimecode(s.offset, ".");
      const end = formatTimecode(s.offset + s.duration, ".");
      return `${start} --> ${end}\n${s.text.trim()}\n`;
    })
    .join("\n");
  return `WEBVTT\n\n${body}`;
}

function buildPlainParagraphs(segments: Segment[], groupEvery = 30_000): string {
  if (segments.length === 0) return "";
  const groups: string[][] = [];
  let currentGroup: string[] = [];
  let groupStart = segments[0].offset;

  for (const seg of segments) {
    if (seg.offset - groupStart >= groupEvery && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [];
      groupStart = seg.offset;
    }
    currentGroup.push(seg.text.trim());
  }
  if (currentGroup.length > 0) groups.push(currentGroup);

  return groups.map((g) => g.join(" ")).join("\n\n");
}

function stripFillerWords(text: string): string {
  return text.replace(FILLER_WORDS_RE, " ").replace(/\s{2,}/g, " ").trim();
}

export default function TranscribePage() {
  const [url, setUrl] = React.useState("");
  const [transcript, setTranscript] = React.useState("");
  const [segments, setSegments] = React.useState<Segment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"plain" | "timestamped">("plain");

  // Pro options
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("plain");
  const [groupParagraphs, setGroupParagraphs] = React.useState(false);
  const [stripFillers, setStripFillers] = React.useState(false);

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

  /** Compute the text to display, applying Pro format + post-processing. */
  const displayText = React.useMemo(() => {
    // Pro export formats override the view toggle
    if (exportFormat === "srt") {
      return buildSrt(segments);
    }
    if (exportFormat === "vtt") {
      return buildVtt(segments);
    }

    // "plain" or "timestamped" from Pro select, or from the view buttons
    const effectiveView: "plain" | "timestamped" =
      exportFormat === "timestamped" ? "timestamped" : view;

    if (effectiveView === "timestamped") {
      let text = timestampedText;
      if (stripFillers) text = stripFillerWords(text);
      return text;
    }

    // plain
    let text: string;
    if (groupParagraphs && segments.length > 0) {
      text = buildPlainParagraphs(segments);
    } else {
      text = transcript;
    }
    if (stripFillers) text = stripFillerWords(text);
    return text;
  }, [exportFormat, view, transcript, timestampedText, segments, groupParagraphs, stripFillers]);

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

          <div className="mt-4">
            <ProOptionsPanel
              title="Transcript options"
              description="Control output format, paragraph grouping, and filler-word removal."
            >
              <ProField
                label="Export format"
                hint="SRT and VTT require segment timestamps from the API."
              >
                <Select
                  value={exportFormat}
                  onValueChange={(v) => setExportFormat(v as ExportFormat)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain text</SelectItem>
                    <SelectItem value="timestamped">Timestamped</SelectItem>
                    <SelectItem value="srt">SRT subtitles</SelectItem>
                    <SelectItem value="vtt">VTT subtitles</SelectItem>
                  </SelectContent>
                </Select>
              </ProField>

              <ProField
                label="Group into paragraphs"
                hint="Groups consecutive segments into paragraphs ~every 30 seconds (plain view only)."
              >
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupParagraphs}
                    onChange={(e) => setGroupParagraphs(e.target.checked)}
                    className="accent-primary"
                  />
                  Group by ~30s blocks
                </label>
              </ProField>

              <ProField
                label="Strip filler words"
                hint='Removes standalone "uh", "um", "you know", "like", "er".'
              >
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stripFillers}
                    onChange={(e) => setStripFillers(e.target.checked)}
                    className="accent-primary"
                  />
                  Remove filler words
                </label>
              </ProField>
            </ProOptionsPanel>
          </div>
        </CardContent>
      </Card>

      {transcript && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transcript</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={view === "plain" && exportFormat === "plain" ? "default" : "outline"}
                size="sm"
                onClick={() => { setView("plain"); setExportFormat("plain"); }}
              >
                Plain
              </Button>
              <Button
                variant={view === "timestamped" && exportFormat === "plain" ? "default" : "outline"}
                size="sm"
                onClick={() => { setView("timestamped"); setExportFormat("plain"); }}
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

      <ToolUsageTip />

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 fetches/day</Badge>
        <span>
          Transcripts are pulled from YouTube&apos;s captions when available.
        </span>
      </div>
    </div>
  );
}
