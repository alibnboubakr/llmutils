import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        // Update user plan to Pro in Supabase
        const { error } = await supabase
          .from("profiles")
          .update({ 
            plan: "pro",
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating user to Pro:", error);
        } else {
          console.log("User upgraded to Pro:", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // Map Stripe status to our plan
        const plan = status === "active" ? "pro" : "free";

        // Find user by Stripe customer ID
        const { data: profiles, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (fetchError || !profiles) {
          console.error("Error finding user by customer ID:", fetchError);
          break;
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profiles.id);

        if (updateError) {
          console.error("Error updating subscription status:", updateError);
        } else {
          console.log("Subscription updated:", profiles.id, plan);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID and downgrade to free
        const { data: profiles, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (fetchError || !profiles) {
          console.error("Error finding user by customer ID:", fetchError);
          break;
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            plan: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profiles.id);

        if (updateError) {
          console.error("Error downgrading user:", updateError);
        } else {
          console.log("User downgraded to free:", profiles.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
