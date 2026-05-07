// KPI Tracking with PostHog (PLG Metrics)
// Install: npm install posthog-js

// Dynamic import for posthog-js to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let posthog: any = null;

if (typeof window !== "undefined") {
  import("posthog-js").then((module) => {
    posthog = module.default;
    
    // Initialize PostHog
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY || "ph_project_token";
    if (apiKey && apiKey !== "ph_project_token") {
      posthog.init(apiKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        loaded: (posthogInstance: any) => {
          if (process.env.NODE_ENV === "development") {
            posthogInstance.debug();
          }
        },
      });
    }
  });
}

// PLG Events to Track
export const AnalyticsEvents = {
  // Activation Rate: % of visitors who use a tool
  TOOL_USED: "tool_used",
  
  // Account Creation Rate: % of activated users who sign up
  SIGNUP_COMPLETED: "signup_completed",
  
  // Free-to-Pro Conversion Rate
  PAYWALL_HIT: "paywall_hit",
  UPGRADE_COMPLETED: "upgrade_completed",
  
  // Expansion MRR
  TEAM_PLAN_UPGRADE: "team_plan_upgrade",
  
  // Tool-specific events
  MARKDOWN_CONVERTED: "markdown_converted",
  SANITIZE_APPLIED: "sanitize_applied",
  JSON_CONVERTED: "json_converted",
  
  // Pipeline Continuity (Pro feature)
  PIPELINE_USED: "pipeline_used",
  
  // Community
  TOOL_REQUEST_SUBMITTED: "tool_request_submitted",
  TOOL_REQUEST_UPVOTED: "tool_request_upvoted",
};

// Helper functions
export function trackToolUsage(tool: string, userId?: string, isPro: boolean = false) {
  if (!posthog) return;
  
  posthog.capture(AnalyticsEvents.TOOL_USED, {
    tool,
    user_id: userId,
    is_pro: isPro,
  });
}

export function trackSignup(method: "google" | "github" | "email") {
  posthog.capture(AnalyticsEvents.SIGNUP_COMPLETED, {
    method,
  });
}

export function trackPaywallHit(type: "copy_limit" | "blur" | "history") {
  posthog.capture(AnalyticsEvents.PAYWALL_HIT, {
    paywall_type: type,
  });
}

export function trackUpgrade(plan: "pro" | "team", billing: "monthly" | "yearly") {
  posthog.capture(AnalyticsEvents.UPGRADE_COMPLETED, {
    plan,
    billing,
  });
}

export function trackPipelineUsage(fromTool: string, toTool: string) {
  posthog.capture(AnalyticsEvents.PIPELINE_USED, {
    from_tool: fromTool,
    to_tool: toTool,
  });
}

export default posthog;
