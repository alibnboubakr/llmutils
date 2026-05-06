import Stripe from "stripe";

// Only validate in runtime, not during build
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const monthlyPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
const yearlyPriceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;

// Lazy validation - only runs when stripe is actually used
function validateStripeConfig() {
  if (typeof window !== 'undefined') return; // Skip on client-side
  
  if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
    console.error('Warning: STRIPE_SECRET_KEY is not set');
  }
  
  if ((!monthlyPriceId || monthlyPriceId === 'price_your_monthly_pro_price_id_here') && 
      process.env.NODE_ENV === 'production') {
    console.error('Warning: STRIPE_PRO_MONTHLY_PRICE_ID is not properly configured');
  }
  
  if ((!yearlyPriceId || yearlyPriceId === 'price_your_yearly_pro_price_id_here') && 
      process.env.NODE_ENV === 'production') {
    console.error('Warning: STRIPE_PRO_YEARLY_PRICE_ID is not properly configured');
  }
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
  typescript: true,
});

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  validateStripeConfig();
}

export const PRO_MONTHLY_PRICE_ID = monthlyPriceId || "price_your_monthly_pro_price_id_here";
export const PRO_YEARLY_PRICE_ID = yearlyPriceId || "price_your_yearly_pro_price_id_here";

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  userId,
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // Update user plan in Supabase based on subscription status
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // Map Stripe status to our plan
  const plan = status === "active" ? "pro" : "free";

  return { customerId, plan };
}
