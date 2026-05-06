import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Service role key is required").optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe secret key is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "Stripe webhook secret is required"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, "Stripe publishable key is required"),
  STRIPE_PRO_MONTHLY_PRICE_ID: z.string().min(1, "Monthly price ID is required"),
  STRIPE_PRO_YEARLY_PRICE_ID: z.string().min(1, "Yearly price ID is required"),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url("Invalid app URL"),
  
  // Optional
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_PROJECT_ID: z.string().optional(),
});

// Validate environment variables at runtime (client-side safe version)
export function validateEnv() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_PRO_MONTHLY_PRICE_ID: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    STRIPE_PRO_YEARLY_PRICE_ID: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
    POSTHOG_PROJECT_ID: process.env.POSTHOG_PROJECT_ID,
  };

  try {
    envSchema.parse(env);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      return { success: false, error: issues.join('\n') };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}

// Call this in your app startup (e.g., in layout.tsx or middleware)
export function ensureEnvVars() {
  if (typeof window === 'undefined') {
    // Server-side only
    const result = validateEnv();
    if (!result.success) {
      console.error('Environment validation failed:\n' + result.error);
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment configuration');
      }
    }
  }
}
