import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// --- Stripe ---
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY env");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// --- Firebase Admin ---
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Missing Firebase Admin env variables");
}
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    if (typeof sessionId !== "string") {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    // Fetch Stripe session without line items expansion
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer_details"],
    });

    const lineItemsResp = await stripe.checkout.sessions.listLineItems(
      sessionId,
      {
        expand: ["data.price.product"],
      }
    );

    if (!session || !session.id || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Session not paid or not found" },
        { status: 400 }
      );
    }

    const lineItems = (lineItemsResp.data || []).map((li) => ({
      id: li.id,
      productId: (li.price?.product as any)?.id || null,
      name: (li.price?.product as any)?.name || li.description || "",
      image: (li.price?.product as any)?.images?.[0] || null,
      unit_amount:
        typeof li.price?.unit_amount === "number"
          ? li.price.unit_amount / 100
          : 0,
      quantity: li.quantity || 1,
      currency: li.currency || session.currency || "usd",
    }));

    // Prevent duplicate orders (idempotency by session id)
    let existingSnap;
    try {
      existingSnap = await db
        .collection("orders")
        .where("stripeSessionId", "==", session.id)
        .limit(1)
        .get();
    } catch (e) {
      console.error("Duplicate check failed:", e);
      existingSnap = null;
    }

    if (existingSnap && !existingSnap.empty) {
      const existingId = existingSnap.docs[0].id;
      return NextResponse.json(
        { success: true, orderId: existingId, duplicate: true },
        { status: 200 }
      );
    }

    const orderDoc = {
      stripeSessionId: session.id,
      paymentIntentId: (session.payment_intent as any)?.id || null,
      userId: session.metadata?.userId || null,
      customerEmail: session.customer_details?.email || null,
      appliedCouponId: session.metadata?.appliedCouponId || null,
      subtotal: session.metadata?.subtotal
        ? Number(session.metadata.subtotal)
        : session.amount_subtotal
          ? session.amount_subtotal / 100
          : null,
      discount: session.metadata?.discountAmount
        ? Number(session.metadata.discountAmount)
        : session.total_details?.amount_discount
          ? session.total_details.amount_discount / 100
          : 0,
      total: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency || "usd",
      status: "paid",
      items: lineItems,
      createdAt: FieldValue.serverTimestamp(),
    };

    const ref = await db.collection("orders").add(orderDoc);

    return NextResponse.json(
      { success: true, orderId: ref.id },
      { status: 201, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
