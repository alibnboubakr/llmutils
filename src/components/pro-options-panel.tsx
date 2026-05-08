"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Lock, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProBadge } from "@/components/pro-badge";
import { useUserPlan } from "@/lib/use-user-plan";

type ProOptionsPanelProps = {
  /** Title shown in the panel header. Default: "Fine-tune output". */
  title?: string;
  /** One-liner explaining what this panel changes. */
  description?: string;
  /** The form controls. They will render disabled for free users. */
  children: React.ReactNode;
  /** Start expanded. Default true on Pro, false otherwise. */
  defaultOpen?: boolean;
  className?: string;
};

// Disclosure-style panel that wraps Pro-only fine-tuning controls. For free
// users, controls render visibly but disabled, with an Upgrade overlay; the
// user can see exactly what they unlock by upgrading.
export function ProOptionsPanel({
  title = "Fine-tune output",
  description,
  children,
  defaultOpen,
  className,
}: ProOptionsPanelProps) {
  const { isPro, loading } = useUserPlan();
  const [open, setOpen] = React.useState(defaultOpen ?? false);

  // Auto-open for Pro users once we know they're Pro.
  React.useEffect(() => {
    if (isPro && defaultOpen === undefined) setOpen(true);
  }, [isPro, defaultOpen]);

  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br from-background to-muted/30",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sliders className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{title}</span>
            <ProBadge />
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="relative border-t">
          <div
            className={cn(
              "p-4 space-y-4",
              !isPro && "pointer-events-none select-none opacity-60"
            )}
            aria-disabled={!isPro}
          >
            <fieldset disabled={!isPro && !loading} className="space-y-4">
              {children}
            </fieldset>
          </div>

          {!isPro && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/70 to-transparent p-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">
                  Fine-tuning is a Pro feature
                </p>
                <p className="text-xs text-muted-foreground mb-3 max-w-xs mx-auto">
                  Tweak how each tool processes your input — different output,
                  every time.
                </p>
                <Link href="/settings">
                  <Button size="sm">Upgrade to Pro</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Helper field row used inside ProOptionsPanel for a label + control. */
export function ProField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
