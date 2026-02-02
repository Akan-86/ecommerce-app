import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// --- Stripe ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// --- Firebase Admin ---
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

    // Fetch Stripe session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product", "payment_intent"],
    });

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Session not paid or not found" },
        { status: 400 }
      );
    }

    const lineItems = (session.line_items?.data || []).map((li) => ({
      id: li.id,
      productId: (li.price?.product as any)?.id || null,
      name: (li.price?.product as any)?.name || li.description || "",
      image: (li.price?.product as any)?.images?.[0] || null,
      unit_amount: li.price?.unit_amount ? li.price.unit_amount / 100 : 0,
      quantity: li.quantity || 1,
      currency: li.currency || session.currency || "usd",
    }));

    const orderDoc = {
      stripeSessionId: session.id,
      paymentIntentId: (session.payment_intent as any)?.id || null,
      userId: session.metadata?.userId || null,
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
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
