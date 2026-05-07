"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy } from "lucide-react";

// RFC 4180 CSV parser: handles quoted fields, embedded commas/newlines, escaped quotes.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      // Handle \r\n by skipping the \n that follows \r
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  // Flush final field/row
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop fully-empty trailing rows
  while (rows.length && rows[rows.length - 1].every((c) => c === "")) {
    rows.pop();
  }

  return rows;
}

function coerceValue(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d*\.\d+$/.test(trimmed)) return Number(trimmed);
  return raw;
}

export default function CsvToJsonPage() {
  const [csvData, setCsvData] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const convertCsvToJson = () => {
    if (!csvData) return;
    setLoading(true);
    setError(null);

    try {
      const rows = parseCsv(csvData);
      if (rows.length < 2) {
        throw new Error("CSV must have a header row and at least one data row");
      }

      const headers = rows[0].map((h) => h.trim());
      const result = rows.slice(1).map((row) => {
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          obj[header] = coerceValue(row[index] ?? "");
        });
        return obj;
      });

      setJsonOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CSV to JSON</h1>
        <p className="text-muted-foreground mt-2">
          Upload a CSV file and convert it to JSON format.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="flex-1"
              />
            </div>
            {csvData && (
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-48">
                {csvData.substring(0, 500)}
                {csvData.length > 500 && "..."}
              </pre>
            )}
            <Button
              onClick={convertCsvToJson}
              disabled={loading || !csvData}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Convert to JSON
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {jsonOutput && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>JSON Output</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px]">
              {jsonOutput}
            </pre>
          </CardContent>
        </Card>
      )}

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions</span>
      </div>
    </div>
  );
}
