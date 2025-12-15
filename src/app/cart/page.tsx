"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { RemoveFromCartButton } from "@/components/remove-from-cart-button";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/auth-context";
import Spinner from "@/components/Spinner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const { items, total, clear, getStripeItems } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: getStripeItems(),
          userId: user?.uid || "",
        }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const { sessionId } = await res.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-4xl">🛒</div>
        <p className="text-lg font-semibold text-gray-800">
          Your cart is empty
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven’t added anything yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
      <div className="md:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Shopping Cart
        </h2>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-4 last:border-b-0"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} × ${item.price}
              </p>
            </div>
            <RemoveFromCartButton productId={item.id} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Order Summary
        </h3>

        <div className="mb-4 flex justify-between text-sm text-gray-700">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="mb-6 flex justify-between text-sm text-gray-700">
          <span>Estimated tax</span>
          <span>Calculated at checkout</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-gray-900 transition hover:bg-yellow-500 disabled:opacity-60"
        >
          {isLoading && <Spinner />}
          <span>{isLoading ? "Redirecting..." : "Proceed to Checkout"}</span>
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
}
