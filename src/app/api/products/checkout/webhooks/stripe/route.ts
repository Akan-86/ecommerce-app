// app/api/stripe/webhook/route.ts

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
} from "firebase/firestore";

// Ensure Node.js runtime for raw body access (required for Stripe signature verification)
export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Fail-fast in production if envs are missing; warn in development
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
  // Stripe webhook needs the raw body, so use req.text()
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

  // Handle only the events we expect
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Fetch line items for the session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // Adjust stock for each item
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

      // Persist order data if we have a userId in metadata
      const userId = session.metadata?.userId ?? null;
      if (userId) {
        await addDoc(collection(db, "orders"), {
          userId,
          items: lineItems.data.map((item) => ({
            name: item.description ?? "",
            quantity: item.quantity ?? 1,
            amount: item.amount_total ?? 0, // amount in smallest currency unit
          })),
          total: session.amount_total ?? 0, // amount in smallest currency unit
          createdAt: serverTimestamp(),
          status: "paid",
          sessionId: session.id,
        });
      } else {
        console.warn(
          "⚠️ session.metadata.userId missing; order not linked to a user."
        );
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
