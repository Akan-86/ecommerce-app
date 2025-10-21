import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      for (const item of lineItems.data) {
        const productId = item.price?.product as string;
        const quantity = item.quantity || 1;

        if (productId) {
          const productRef = doc(db, "products", productId);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const currentStock = productSnap.data().stock || 0;
            await updateDoc(productRef, {
              stock: Math.max(currentStock - quantity, 0),
              updatedAt: Date.now(),
            });
          }
        }
      }

      const userId = session.metadata?.userId;
      if (userId) {
        await addDoc(collection(db, "orders"), {
          userId,
          items: lineItems.data.map((item) => ({
            name: item.description,
            quantity: item.quantity,
            amount: item.amount_total,
          })),
          total: session.amount_total,
          createdAt: Date.now(),
          status: "paid",
        });
      }
    } catch (err) {
      console.error("❌ Error handling checkout.session.completed:", err);
      return NextResponse.json(
        { error: "Webhook handling failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
