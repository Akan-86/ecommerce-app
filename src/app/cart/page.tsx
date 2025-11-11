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
      <div className="text-center py-12">
        <p className="text-lg font-medium text-gray-700">
          🛒 Your cart is empty
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-4"
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

      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={clear}
          className="px-4 py-2 bg-blue-600 text-white rounded 
             transition-transform duration-300 
             hover:scale-105 hover:bg-blue-700"
        >
          Clear Cart
        </button>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded 
             transition-transform duration-300 
             hover:scale-105 hover:bg-blue-700"
      >
        {isLoading && <Spinner />}
        <span>{isLoading ? "Redirecting..." : "Checkout"}</span>
      </button>
    </div>
  );
}
