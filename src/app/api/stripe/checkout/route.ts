import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer for user
    const supabase = await createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    const customerId = profile?.stripe_customer_id;

    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      userId,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
