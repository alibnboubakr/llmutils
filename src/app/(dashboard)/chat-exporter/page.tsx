"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, FileJson, Presentation } from "lucide-react";

export default function ChatExporterPage() {
  const [chatText, setChatText] = useState(`User: How do I implement authentication in Next.js?

Assistant: To implement authentication in Next.js, you can use several approaches:

1. **Using NextAuth.js (Auth.js)**
   - Install: \`npm install next-auth\`
   - Create \`[...nextauth].ts\` API route
   - Configure providers (Google, GitHub, etc.)

2. **Using Supabase Auth**
   - Install: \`npm install @supabase/supabase-js\`
   - Use Supabase client for auth operations

3. **Custom JWT Implementation**
   - Create login API endpoint
   - Use jsonwebtoken library
   - Store token in httpOnly cookie

Which approach would you like me to elaborate on?

User: Tell me more about Supabase Auth

Assistant: Sure! Here's how to implement Supabase Auth in Next.js:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
\`\`\`

Key features:
- Email/Password auth
- OAuth (Google, GitHub, etc.)
- Magic link (passwordless)
- Row Level Security (RLS) integration
`);

  const [exportFormat, setExportFormat] = useState<"markdown" | "pdf" | "notion" | "slides">("markdown");
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    // In production, this would generate the actual file
    // For now, simulate export
    setExported(true);
    setTimeout(() => setExported(false), 3000);

    if (exportFormat === "markdown") {
      const blob = new Blob([chatText], { type: "text/markdown" });
      downloadBlob(blob, "chat-export.md");
    } else if (exportFormat === "pdf") {
      alert("PDF export would be generated here using a library like puppeteer or jsPDF");
    } else if (exportFormat === "notion") {
      alert("Notion export would integrate with Notion API to create a new page");
    } else if (exportFormat === "slides") {
      alert("Slides export would convert chat to presentation format");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Chat Exporter</h1>
        <p className="text-muted-foreground mt-2">
          Convert ChatGPT/Claude markdown exports into PDF, Notion, or Slides.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat Content</CardTitle>
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
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Export Format:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={exportFormat === "markdown" ? "default" : "outline"}
                    onClick={() => setExportFormat("markdown")}
                    className="justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Markdown
                  </Button>
                  <Button
                    variant={exportFormat === "pdf" ? "default" : "outline"}
                    onClick={() => setExportFormat("pdf")}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant={exportFormat === "notion" ? "default" : "outline"}
                    onClick={() => setExportFormat("notion")}
                    className="justify-start"
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    Notion
                  </Button>
                  <Button
                    variant={exportFormat === "slides" ? "default" : "outline"}
                    onClick={() => setExportFormat("slides")}
                    className="justify-start"
                  >
                    <Presentation className="h-4 w-4 mr-2" />
                    Slides
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Format Details:</h4>
                {exportFormat === "markdown" && (
                  <p className="text-sm text-muted-foreground">
                    Exports as .md file preserving formatting, code blocks, and structure.
                  </p>
                )}
                {exportFormat === "pdf" && (
                  <p className="text-sm text-muted-foreground">
                    Generates a PDF document with proper formatting and page breaks.
                  </p>
                )}
                {exportFormat === "notion" && (
                  <p className="text-sm text-muted-foreground">
                    Creates a new Notion page with the chat content (requires Notion API key).
                  </p>
                )}
                {exportFormat === "slides" && (
                  <p className="text-sm text-muted-foreground">
                    Converts chat into presentation slides format (PowerPoint, Google Slides).
                  </p>
                )}
              </div>

              <Button
                onClick={handleExport}
                disabled={!chatText}
                className="w-full"
              >
                {exported ? (
                  "Exported!"
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export as {exportFormat.charAt(0).toUpperCase() + exportFormat.slice(1)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 exports/day</Badge>
        <span>Upgrade to Pro for unlimited exports and batch processing</span>
      </div>
    </div>
  );
}
