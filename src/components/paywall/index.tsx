import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface CopyLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CopyLimitModal({ open, onOpenChange }: CopyLimitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Daily Copy Limit Reached
          </DialogTitle>
          <DialogDescription>
            You've hit your daily limit for this tool. Upgrade to Pro for unlimited copies.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Free Plan</span>
            <Badge variant="secondary">5 copies/day</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pro Plan</span>
            <Badge>Unlimited</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button className="flex-1">
            Upgrade to Pro ($9/month)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BlurOverlayProps {
  children: React.ReactNode;
  showUpgrade?: boolean;
}

export function BlurOverlay({ children, showUpgrade = true }: BlurOverlayProps) {
  return (
    <div className="relative">
      <div className="blur-sm select-none pointer-events-none">{children}</div>
      {showUpgrade && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
          <Badge className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
            PRO — Upgrade to unblur
          </Badge>
        </div>
      )}
    </div>
  );
}

interface HistoryTeaseProps {
  onClick?: () => void;
}

export function HistoryTease({ onClick }: HistoryTeaseProps) {
  return (
    <div
      className="p-4 border border-dashed rounded-md text-center cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <p className="text-sm text-muted-foreground">
        <Lock className="h-4 w-4 inline mr-1" />
        Unlock full history with Pro
      </p>
    </div>
  );
}
