import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment,
  setDoc,
} from "firebase/firestore";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20",
});

function calculateStripeFee(amount: number) {
  return Math.round(amount * 0.029 + 30);
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  /**
   * Prevent duplicate webhook processing
   */
  const eventRef = doc(db, "webhookEvents", event.id);
  const existingEvent = await getDoc(eventRef);

  if (existingEvent.exists()) {
    return NextResponse.json({ received: true });
  }

  await setDoc(eventRef, {
    receivedAt: serverTimestamp(),
  });

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    /**
     * Get line items
     */
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    /**
     * Cache products to avoid multiple Firestore reads
     */
    const productCache: Record<string, any> = {};

    /**
     * Update stock + sales counter
     */
    for (const item of lineItems.data) {
      const productId =
        typeof item.price?.product === "string" ? item.price.product : null;

      const quantity = item.quantity ?? 1;

      if (!productId) continue;

      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) continue;

      const productData = productSnap.data();

      productCache[productId] = productData;

      await updateDoc(productRef, {
        stock: increment(-quantity),
        salesCount: increment(quantity),
        updatedAt: serverTimestamp(),
      });
    }

    /**
     * Metadata
     */
    const metadata = session.metadata || {};

    const userId = metadata.userId ?? null;
    const appliedCouponId = metadata.appliedCouponId ?? null;

    const discountAmount = metadata.discountAmount
      ? Number(metadata.discountAmount)
      : 0;

    const subtotal = metadata.subtotal ? Number(metadata.subtotal) : 0;

    const total =
      typeof session.amount_total === "number"
        ? Number(session.amount_total)
        : subtotal - discountAmount;

    /**
     * Stripe fee + revenue
     */
    const stripeFee = calculateStripeFee(total);

    /**
     * Build order items
     */
    const items = lineItems.data.map((item) => {
      const productId =
        typeof item.price?.product === "string" ? item.price.product : null;

      const product = productId ? productCache[productId] : null;

      const cost = product?.cost ?? 0;

      return {
        name: item.description ?? "",
        quantity: item.quantity ?? 1,
        price: item.price?.unit_amount ?? 0,
        amount: item.amount_total ?? 0,
        productId,
        cost,
      };
    });

    /**
     * Calculate cost + profit
     */
    const totalCost = items.reduce(
      (acc, item) => acc + item.cost * item.quantity,
      0
    );

    const profit = total - stripeFee - totalCost;

    /**
     * Save order
     */
    await addDoc(collection(db, "orders"), {
      userId,
      items,
      total,
      subtotal,
      discount: discountAmount,
      stripeFee,
      cost: totalCost,
      profit,
      appliedCouponId: appliedCouponId || null,
      sessionId: session.id,
      status: "paid",
      createdAt: serverTimestamp(),
    });

    /**
     * Update coupon usage
     */
    if (appliedCouponId) {
      try {
        const couponRef = doc(db, "coupons", appliedCouponId);

        await updateDoc(couponRef, {
          usageCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Coupon update error:", err);
      }
    }

    /**
     * Update analytics
     */
    const todayKey = getTodayKey();

    const analyticsRef = doc(db, "analytics", todayKey);

    await setDoc(
      analyticsRef,
      {
        revenue: increment(total),
        profit: increment(profit),
        orders: increment(1),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Webhook processing error:", err);

    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
