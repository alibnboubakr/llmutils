import Link from "next/link";
import { ArrowRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TranscribePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Youtube className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Transcribe</h1>
          <p className="text-muted-foreground mb-2">
            Pull text transcripts from YouTube videos.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Coming soon. We&apos;re hooking this up to a real transcript
            provider so you get the actual video text, not a placeholder.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">
              Back to dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
