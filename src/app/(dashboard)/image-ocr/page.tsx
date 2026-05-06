"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Upload, Loader2 } from "lucide-react";

export default function ImageOcrPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");

    try {
      // In production, use Tesseract.js or a cloud OCR API (Google Vision, AWS Textract)
      // For now, simulate OCR extraction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock extracted text
      setExtractedText(`[OCR Extracted Text from ${selectedFile.name}]

This is a simulated OCR result. In production, this would:
1. Use Tesseract.js for client-side OCR, OR
2. Send to a cloud OCR API (Google Vision, AWS Textract)
3. Return the extracted text ready for LLM context

For now, this demonstrates the UI flow for the Image/OCR to Text tool.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Image / OCR to Text</h1>
        <p className="text-muted-foreground mt-2">
          Upload an image or screenshot and extract text for LLM context.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />

              {preview && (
                <div className="border rounded-md overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                </div>
              )}

              <Button
                onClick={handleExtract}
                disabled={loading || !selectedFile}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Extracting Text...
                  </>
                ) : (
                  "Extract Text (OCR)"
                )}
              </Button>

              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {extractedText && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Extracted Text</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px]">
                {extractedText}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited OCR extractions</span>
      </div>
    </div>
  );
}
