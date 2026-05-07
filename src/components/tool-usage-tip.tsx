import { Sparkles } from "lucide-react";

export function ToolUsageTip() {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-muted/70 p-4 text-sm text-muted-foreground shadow-sm">
      <div className="flex items-center gap-2 font-medium text-foreground mb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        Tool usage tip
      </div>
      <p>
        Your free allowance is only deducted when you execute the tool action.
        Feel free to refine your text before clicking the main button.
      </p>
    </div>
  );
}
