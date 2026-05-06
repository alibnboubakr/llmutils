"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Plus, Lightbulb } from "lucide-react";

interface ToolRequest {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  status: "pending" | "in-progress" | "shipped";
}

// Mock data - in production, fetch from Supabase
const initialRequests: ToolRequest[] = [
  {
    id: "1",
    title: "SQL Query Generator",
    description: "Convert natural language to SQL queries",
    upvotes: 42,
    status: "pending",
  },
  {
    id: "2",
    title: "Image to Base64",
    description: "Convert images to base64 encoded strings",
    upvotes: 28,
    status: "in-progress",
  },
  {
    id: "3",
    title: "JSON to CSV",
    description: "Reverse of CSV to JSON tool",
    upvotes: 35,
    status: "pending",
  },
];

export default function RequestPage() {
  const [requests, setRequests] = useState<ToolRequest[]>(initialRequests);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newRequest: ToolRequest = {
      id: Date.now().toString(),
      title,
      description,
      upvotes: 1,
      status: "pending",
    };

    setRequests([newRequest, ...requests]);
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  const handleUpvote = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, upvotes: req.upvotes + 1 } : req
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Community Requests</h1>
        <p className="text-muted-foreground mt-2">
          Suggest new tools and upvote the ones you need most.
        </p>
      </div>

      {/* Submit Button */}
      <div className="mb-8">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Request a Tool"}
        </Button>
      </div>

      {/* Request Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit Tool Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Tool name (e.g., SQL Query Generator)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Describe what this tool should do..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!title}>
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{req.title}</h3>
                    <Badge
                      variant={
                        req.status === "shipped"
                          ? "default"
                          : req.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {req.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUpvote(req.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {req.upvotes}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro CTA */}
      <Card className="mt-12 bg-primary/5 border-primary/20">
        <CardContent className="py-8 text-center">
          <Lightbulb className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Want to prioritize your request?
          </h3>
          <p className="text-muted-foreground mb-4">
            Pro users get priority consideration for tool requests.
          </p>
          <Button>
            Upgrade to Pro <ThumbsUp className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
