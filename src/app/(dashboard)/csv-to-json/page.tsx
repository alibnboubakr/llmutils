"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Upload } from "lucide-react";

export default function CsvToJsonPage() {
  const [csvData, setCsvData] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const convertCsvToJson = () => {
    if (!csvData) return;
    setLoading(true);

    try {
      const lines = csvData.split("\n").filter((line) => line.trim());
      if (lines.length < 2) throw new Error("CSV must have at least a header and one data row");

      const headers = lines[0].split(",").map((h) => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || "";
        });
        result.push(obj);
      }

      setJsonOutput(JSON.stringify(result, null, 2));
    } catch (error: any) {
      alert(error.message);
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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions</span>
      </div>
    </div>
  );
}
