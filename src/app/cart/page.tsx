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
      <div className="mx-auto mt-24 max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mb-4 text-5xl">🛒</div>
        <h2 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven’t added anything yet.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Continue shopping
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-6xl px-4">
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-gray-100 py-5 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {item.quantity} × ${item.price}
                </p>
              </div>
              <RemoveFromCartButton productId={item.id} />
            </div>
          ))}
        </div>

        <div className="sticky top-24 h-fit rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Order Summary
          </h3>

          <div className="mb-4 flex justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="mb-6 flex justify-between text-sm text-gray-700">
            <span>Estimated tax</span>
            <span className="text-gray-400">Calculated at checkout</span>
          </div>

          <div className="mb-6 flex justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
          >
            {isLoading && <Spinner />}
            <span>{isLoading ? "Redirecting…" : "Proceed to Checkout"}</span>
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
