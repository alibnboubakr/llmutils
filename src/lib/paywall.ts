import { z } from "zod";

export const FREE_DAILY_LIMIT = 5;

export interface UsageLimits {
  [toolSlug: string]: number; // count used today
}

// Check if user has hit their daily limit
export function hasReachedLimit(
  usage: UsageLimits,
  toolSlug: string,
  plan: "free" | "pro" | "team"
): boolean {
  if (plan !== "free") return false;
  return (usage[toolSlug] || 0) >= FREE_DAILY_LIMIT;
}

// Increment usage for a tool
export function incrementUsage(
  usage: UsageLimits,
  toolSlug: string
): UsageLimits {
  return {
    ...usage,
    [toolSlug]: (usage[toolSlug] || 0) + 1,
  };
}

// Tool schema for validation
export const toolRunSchema = z.object({
  tool: z.string(),
  input: z.string(),
  output: z.string().optional(),
  userId: z.string().optional(),
});

export type ToolRun = z.infer<typeof toolRunSchema>;
