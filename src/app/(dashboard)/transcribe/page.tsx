"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy } from "lucide-react";

export default function TranscribePage() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranscribe = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      // Simulate transcription (in production, use YouTube API or Whisper)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock transcript
      setTranscript(`[Transcript for ${url}]

This is a simulated transcript. In production, this would:
1. Extract video ID from YouTube URL
2. Use youtube-transcript library or YouTube API
3. Return the full transcript text

For now, this is a placeholder that demonstrates the UI flow.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">YouTube Transcriber</h1>
        <p className="text-muted-foreground mt-2">
          Paste a YouTube URL and get the transcript text.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTranscribe()}
            />
            <Button onClick={handleTranscribe} disabled={loading || !url}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transcribe"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {transcript && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transcript</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px]">
              {transcript}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited transcriptions</span>
      </div>
    </div>
  );
}
