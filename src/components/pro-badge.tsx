import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProBadge({
  className,
  withIcon = true,
}: {
  className?: string;
  withIcon?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/70 text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5",
        className
      )}
    >
      {withIcon && <Sparkles className="h-3 w-3" />}
      Pro
    </span>
  );
}
