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
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Copy, Loader2, Upload, Trash2 } from "lucide-react";
import { useTrackUsage } from "@/lib/use-track-usage";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OcrLanguage =
  | "eng" | "spa" | "fra" | "deu" | "ita" | "por"
  | "nld" | "jpn" | "chi_sim" | "kor" | "ara" | "rus";

const OCR_LANGUAGES: { value: OcrLanguage; label: string }[] = [
  { value: "eng", label: "English" },
  { value: "spa", label: "Spanish" },
  { value: "fra", label: "French" },
  { value: "deu", label: "German" },
  { value: "ita", label: "Italian" },
  { value: "por", label: "Portuguese" },
  { value: "nld", label: "Dutch" },
  { value: "jpn", label: "Japanese" },
  { value: "chi_sim", label: "Chinese (Simplified)" },
  { value: "kor", label: "Korean" },
  { value: "ara", label: "Arabic" },
  { value: "rus", label: "Russian" },
];

export default function ImageOcrPage() {
  const trackUsage = useTrackUsage("image-ocr");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Pro options
  const [ocrLanguage, setOcrLanguage] = React.useState<OcrLanguage>("eng");
  const [autoTrim, setAutoTrim] = React.useState(true);
  const [lowercase, setLowercase] = React.useState(false);
  const [collapseToSingleLine, setCollapseToSingleLine] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function applyPostProcessing(raw: string): string {
    let result = raw;
    if (autoTrim) {
      result = result
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n");
    }
    if (lowercase) {
      result = result.toLowerCase();
    }
    if (collapseToSingleLine) {
      result = result.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();
    }
    return result;
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setText("");
    setProgress(0);
    setStatus("Loading…");
    setLoading(true);

    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(file, ocrLanguage, {
        logger: (m) => {
          if (typeof m.progress === "number") {
            setProgress(Math.round(m.progress * 100));
          }
          if (m.status) setStatus(m.status);
        },
      });
      const processed = applyPostProcessing(data.text.trim());
      setText(processed);
      setStatus("Done");
      void trackUsage();
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setText("");
    setProgress(0);
    setStatus("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Image OCR</h1>
        <p className="text-muted-foreground mt-2">
          Extract text from screenshots and scanned documents — runs entirely
          in your browser.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {!imageUrl ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full min-h-[260px] flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
              >
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm">Click or drop an image to scan</span>
              </button>
            ) : (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Selected"
                  className="w-full max-h-[320px] rounded-md object-contain bg-muted"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <ProOptionsPanel
                title="OCR options"
                description="Control language detection and output post-processing."
              >
                <ProField label="Language" hint="The language of text in the image.">
                  <Select
                    value={ocrLanguage}
                    onValueChange={(v) => setOcrLanguage(v as OcrLanguage)}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OCR_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </ProField>

                <ProField
                  label="Auto-trim"
                  hint="Trim each line and drop blank lines from the result."
                >
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTrim}
                      onChange={(e) => setAutoTrim(e.target.checked)}
                      className="accent-primary"
                    />
                    Trim lines and remove blanks
                  </label>
                </ProField>

                <ProField label="Lowercase" hint="Convert all extracted text to lowercase.">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lowercase}
                      onChange={(e) => setLowercase(e.target.checked)}
                      className="accent-primary"
                    />
                    Convert to lowercase
                  </label>
                </ProField>

                <ProField
                  label="Collapse to single line"
                  hint="Replace newlines with spaces and collapse extra whitespace."
                >
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collapseToSingleLine}
                      onChange={(e) => setCollapseToSingleLine(e.target.checked)}
                      className="accent-primary"
                    />
                    Collapse to one line
                  </label>
                </ProField>
              </ProOptionsPanel>
            </div>

            {loading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {status} {progress ? `(${progress}%)` : null}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Extracted text</CardTitle>
            {text && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(text)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[260px]">
              {text || (loading ? "Working…" : "Nothing yet. Upload an image to get started.")}
            </pre>
          </CardContent>
        </Card>
      </div>

      <ToolUsageTip />

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Runs locally</Badge>
        <span>Your image never leaves your browser.</span>
      </div>
    </div>
  );
}
