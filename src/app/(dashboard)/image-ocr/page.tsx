import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ImageOcrPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Image OCR</h1>
          <p className="text-muted-foreground mb-2">
            Extract text from images.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Coming soon. We&apos;re wiring up a real OCR backend so this works
            on your screenshots and documents instead of demo text.
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
