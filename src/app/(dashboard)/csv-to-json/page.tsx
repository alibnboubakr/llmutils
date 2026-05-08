"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// RFC 4180 CSV parser: handles quoted fields, embedded commas/newlines, escaped quotes.
// delimiter defaults to "," for free-tier behaviour.
function parseCsv(text: string, delimiter = ","): string[][] {
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
    } else if (text.startsWith(delimiter, i)) {
      row.push(field);
      field = "";
      i += delimiter.length - 1;
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

function isCoercible(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "true" || trimmed === "false" || trimmed === "null")
    return true;
  if (/^-?\d+$/.test(trimmed) || /^-?\d*\.\d+$/.test(trimmed)) return true;
  return false;
}

type DelimiterOption = "," | "\t" | ";" | "|" | "custom";
type CoercionMode = "loose" | "strict" | "off";
type EmptyCellMode = "null" | '""' | "skip";

export default function CsvToJsonPage() {
  const [csvData, setCsvData] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pro options
  const [delimiterOption, setDelimiterOption] = useState<DelimiterOption>(",");
  const [customDelimiter, setCustomDelimiter] = useState("");
  const [firstRowIsHeader, setFirstRowIsHeader] = useState(true);
  const [coercionMode, setCoercionMode] = useState<CoercionMode>("loose");
  const [emptyCellMode, setEmptyCellMode] = useState<EmptyCellMode>('""');

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
      const delim =
        delimiterOption === "custom"
          ? customDelimiter.slice(0, 1) || ","
          : delimiterOption;

      const rows = parseCsv(csvData, delim);

      if (firstRowIsHeader) {
        if (rows.length < 2) {
          throw new Error(
            "CSV must have a header row and at least one data row"
          );
        }

        const headers = rows[0].map((h) => h.trim());
        const dataRows = rows.slice(1);

        // Build coercibility map per column index for "strict" mode
        const colCoercible: boolean[] = headers.map((_, colIdx) =>
          dataRows.every((row) => isCoercible(row[colIdx] ?? ""))
        );

        const result = dataRows.map((row) => {
          const obj: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            const raw = row[index] ?? "";
            const trimmed = raw.trim();

            // Empty cell handling
            if (trimmed === "") {
              if (emptyCellMode === "skip") return;
              if (emptyCellMode === "null") {
                obj[header] = null;
                return;
              }
              // emptyCellMode === '""'
              obj[header] = "";
              return;
            }

            // Coercion
            if (coercionMode === "off") {
              obj[header] = raw;
            } else if (coercionMode === "strict") {
              obj[header] = colCoercible[index] ? coerceValue(raw) : raw;
            } else {
              // loose
              obj[header] = coerceValue(raw);
            }
          });
          return obj;
        });

        setJsonOutput(JSON.stringify(result, null, 2));
      } else {
        // No header row — use col_1, col_2, ...
        if (rows.length < 1) {
          throw new Error("CSV has no data rows");
        }

        const colCount = Math.max(...rows.map((r) => r.length));
        const headers = Array.from({ length: colCount }, (_, i) => `col_${i + 1}`);

        const colCoercible: boolean[] = headers.map((_, colIdx) =>
          rows.every((row) => isCoercible(row[colIdx] ?? ""))
        );

        const result = rows.map((row) => {
          const obj: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            const raw = row[index] ?? "";
            const trimmed = raw.trim();

            if (trimmed === "") {
              if (emptyCellMode === "skip") return;
              if (emptyCellMode === "null") {
                obj[header] = null;
                return;
              }
              obj[header] = "";
              return;
            }

            if (coercionMode === "off") {
              obj[header] = raw;
            } else if (coercionMode === "strict") {
              obj[header] = colCoercible[index] ? coerceValue(raw) : raw;
            } else {
              obj[header] = coerceValue(raw);
            }
          });
          return obj;
        });

        setJsonOutput(JSON.stringify(result, null, 2));
      }
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

            <ProOptionsPanel
              title="Parser options"
              description="Delimiter, headers, type coercion, and empty-cell handling"
            >
              <ProField label="Delimiter">
                <div className="flex items-center gap-2">
                  <Select
                    value={delimiterOption}
                    onValueChange={(v) => setDelimiterOption(v as DelimiterOption)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">, (comma)</SelectItem>
                      <SelectItem value={"\t"}>⇥ (tab)</SelectItem>
                      <SelectItem value=";">; (semicolon)</SelectItem>
                      <SelectItem value="|">| (pipe)</SelectItem>
                      <SelectItem value="custom">Custom…</SelectItem>
                    </SelectContent>
                  </Select>
                  {delimiterOption === "custom" && (
                    <Input
                      value={customDelimiter}
                      onChange={(e) => setCustomDelimiter(e.target.value.slice(0, 1))}
                      placeholder="1 char"
                      className="w-20"
                      maxLength={1}
                    />
                  )}
                </div>
              </ProField>

              <ProField label="First row is header">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={firstRowIsHeader}
                    onChange={(e) => setFirstRowIsHeader(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm">Use first row as field names (when off, keys become col_1, col_2, …)</span>
                </label>
              </ProField>

              <ProField label="Type coercion" hint="Controls how cell values are typed in the JSON output">
                <div className="flex flex-col gap-1.5">
                  {(["loose", "strict", "off"] as CoercionMode[]).map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="coercion"
                        value={mode}
                        checked={coercionMode === mode}
                        onChange={() => setCoercionMode(mode)}
                        className="accent-primary"
                      />
                      <span className="text-sm">
                        {mode === "loose" && "Loose — coerce each cell independently (default)"}
                        {mode === "strict" && "Strict — only coerce if every cell in a column is coercible"}
                        {mode === "off" && "Off — always strings"}
                      </span>
                    </label>
                  ))}
                </div>
              </ProField>

              <ProField label="Empty cells">
                <Select
                  value={emptyCellMode}
                  onValueChange={(v) => setEmptyCellMode(v as EmptyCellMode)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='""'>Empty string "" (default)</SelectItem>
                    <SelectItem value="null">null</SelectItem>
                    <SelectItem value="skip">Skip key entirely</SelectItem>
                  </SelectContent>
                </Select>
              </ProField>
            </ProOptionsPanel>

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
