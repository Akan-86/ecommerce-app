import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || "usd";

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

type IncomingItem = {
  id?: string;
  title?: string;
  price?: number; // in major currency units (e.g., 12.5)
  unit_amount?: number; // in cents (preferred if provided)
  quantity?: number;
  product_data?: {
    name?: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, string>;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    const userId: string | undefined = body.userId;

    const discount: number =
      typeof body.discount === "number" ? body.discount : 0; // major units, e.g., 5.5 => $5.50
    const appliedCouponId: string | undefined = body.appliedCouponId;
    const currency: string = (body.currency as string) || DEFAULT_CURRENCY;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    let subtotalCents = 0;
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item: any) => {
        const quantity = item.quantity ?? 1;
        const unit_amount_cents =
          typeof item.unit_amount === "number"
            ? item.unit_amount
            : item.price
              ? Math.round(Number(item.price) * 100)
              : 0;

        subtotalCents += unit_amount_cents * quantity;

        return {
          price_data: {
            currency,
            product_data: {
              name: item.product_data?.name || item.title || "Unnamed product",
              description: item.product_data?.description || "",
              images: item.product_data?.images || [],
              metadata: {
                productId:
                  item.product_data?.metadata?.productId || item.id || "",
              },
            },
            unit_amount: unit_amount_cents,
          },
          quantity,
        };
      });

    const discountCentsRequested = Math.max(0, Math.round(discount * 100));
    const discountCents = Math.min(discountCentsRequested, subtotalCents);

    let discountsParam:
      | Stripe.Checkout.SessionCreateParams.Discount[]
      | undefined = undefined;
    let createdStripeCouponId: string | undefined = undefined;

    if (discountCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountCents,
        currency,
        duration: "once",
        name: appliedCouponId
          ? `app-coupon-${appliedCouponId}`
          : `temp-coupon-${Date.now()}`,
        metadata: {
          appCouponId: appliedCouponId || "",
          createdBy: "app-temp-coupon",
        },
      });

      createdStripeCouponId = coupon.id;
      discountsParam = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      discounts: discountsParam,
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/cancel`,
      metadata: {
        userId: userId || "",
        appliedCouponId: appliedCouponId || "",
        discountAmount: String(discountCents / 100),
        subtotal: String(subtotalCents / 100),
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
