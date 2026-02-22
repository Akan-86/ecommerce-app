import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, stripeSessionId } = body;

    if (!orderId || !stripeSessionId) {
      return NextResponse.json(
        { error: "Missing orderId or stripeSessionId" },
        { status: 400 }
      );
    }

    // Retrieve checkout session to get payment intent
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

    if (!session.payment_intent) {
      return NextResponse.json(
        { error: "Payment intent not found" },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;

    // Create full refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    // Update Firestore order
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: "Order not found in Firestore" },
        { status: 404 }
      );
    }

    await updateDoc(orderRef, {
      status: "refunded",
      refundedAt: new Date(),
      refundId: refund.id,
      refundAmount: refund.amount,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Refund API error:", error);
    return NextResponse.json(
      { error: "Refund failed", details: error.message },
      { status: 500 }
    );
  }
}
