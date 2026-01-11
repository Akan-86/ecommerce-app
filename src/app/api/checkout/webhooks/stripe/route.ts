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
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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
requireEnv("STRIPE_WEBHOOK_SECRET", STRIPE_WEBHOOK_SECRET);

const stripe = new Stripe(STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error(
      "❌ Webhook signature verification failed:",
      err?.message ?? err
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const ordersRef = collection(db, "orders");
      const existingQuery = query(
        ordersRef,
        where("sessionId", "==", session.id)
      );
      const existingSnap = await getDocs(existingQuery);
      if (!existingSnap.empty) {
        // Already processed
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      for (const item of lineItems.data) {
        const productId =
          typeof item.price?.product === "string" ? item.price.product : null;
        const quantity = item.quantity ?? 1;

        if (productId) {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const currentStock = Number(productSnap.data().stock) || 0;
            await updateDoc(productRef, {
              stock: Math.max(currentStock - quantity, 0),
              updatedAt: serverTimestamp(),
            });
          } else {
            console.warn(`⚠️ Product not found for id: ${productId}`);
          }
        } else {
          console.warn(
            "⚠️ Missing productId on line item, skipping stock update."
          );
        }
      }

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
          : Math.max(0, subtotal - discountAmount);

      const orderDoc = {
        userId,
        items: lineItems.data.map((item) => ({
          name: item.description ?? "",
          quantity: item.quantity ?? 1,
          amount: item.amount_total ?? 0,
          price: item.price?.unit_amount ?? null,
          productId:
            typeof item.price?.product === "string" ? item.price.product : null,
        })),
        total,
        subtotal,
        discount: discountAmount,
        appliedCouponId: appliedCouponId || null,
        createdAt: serverTimestamp(),
        status: "paid",
        sessionId: session.id,
      };

      await addDoc(collection(db, "orders"), orderDoc);

      if (appliedCouponId) {
        try {
          const couponRef = doc(db, "coupons", appliedCouponId);
          await updateDoc(couponRef, {
            usageCount: increment(1),
            updatedAt: serverTimestamp(),
          });
        } catch (couponErr) {
          console.error("❌ Failed to increment coupon usageCount:", couponErr);
        }
      }
    } catch (err) {
      console.error("❌ Error handling checkout.session.completed:", err);
      return NextResponse.json(
        { error: "Webhook handling failed" },
        { status: 500 }
      );
    }
  } else {
    console.info(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
