import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// Fail-fast kontrolü
function requireEnv(key: string, value: string | undefined) {
  if (!value) {
    const msg = `Missing environment variable: ${key}`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    } else {
      console.warn(`⚠️ ${msg}`);
    }
  }
}

requireEnv("STRIPE_SECRET_KEY", STRIPE_SECRET_KEY);
requireEnv("NEXT_PUBLIC_APP_URL", APP_URL);

const stripe = new Stripe(STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

export async function POST(req: NextRequest) {
  try {
    const { items, userId } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product_data?.name || item.title || "Unnamed product",
            description: item.product_data?.description || "",
            images: item.product_data?.images || [],
            metadata: {
              productId:
                item.product_data?.metadata?.productId || item.id || "",
            },
          },
          unit_amount:
            item.unit_amount ??
            (item.price ? Math.round(item.price * 100) : undefined),
        },
        quantity: item.quantity ?? 1,
      }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${APP_URL}/success`,
      cancel_url: `${APP_URL}/cancel`,
      metadata: {
        userId: userId || "",
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("❌ Stripe checkout error:", err?.message ?? err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
