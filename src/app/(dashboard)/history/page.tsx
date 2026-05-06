"use client";

import { History } from "lucide-react";
import { useToolStore } from "@/store/use-tool-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

export default function HistoryPage() {
  const { history, clearHistory } = useToolStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">History</h1>
        {history.length > 0 && (
          <Button variant="outline" onClick={clearHistory}>
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No tool runs yet. Start using tools to build your history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.tool}</CardTitle>
                  <Badge variant="secondary">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Input:</p>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32">
                      {item.input.substring(0, 200)}
                      {item.input.length > 200 && "..."}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Output:</p>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-32">
                      {item.output.substring(0, 200)}
                      {item.output.length > 200 && "..."}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Teaser for Pro */}
      <Card className="mt-8 border-dashed">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-2">
            Free users can see their last 5 runs
          </p>
          <Badge className="bg-primary text-primary-foreground cursor-pointer">
            PRO — Unlock full history
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
