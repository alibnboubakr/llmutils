import { NextRequest, NextResponse } from "next/server";
import {
  createCheckoutSession,
  PRO_MONTHLY_PRICE_ID,
  PRO_YEARLY_PRICE_ID,
} from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const plan = body?.plan === "yearly" ? "yearly" : "monthly";
    const priceId =
      plan === "yearly" ? PRO_YEARLY_PRICE_ID : PRO_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Pricing is not configured" },
        { status: 500 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    const session = await createCheckoutSession({
      customerId: profile?.stripe_customer_id ?? undefined,
      priceId,
      successUrl: `${appUrl}/settings?success=true`,
      cancelUrl: `${appUrl}/settings?canceled=true`,
      userId: user.id,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
