"use client";

import { useCart } from "@/context/cart-context";
import { RemoveFromCartButton } from "@/components/remove-from-cart-button";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const { items, total, clear, getStripeItems } = useCart();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: getStripeItems() }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const { sessionId } = await res.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-gray-700">
          🛒 Your cart is empty
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Add some products to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <ul className="divide-y divide-gray-200 bg-white rounded shadow-sm">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="grid grid-cols-[64px_1fr_auto_auto] items-center gap-4 py-4 px-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl || product.thumbnail}
              alt={product.title}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <div className="font-medium text-gray-800">{product.title}</div>
              <div className="text-gray-600 text-sm">${product.price}</div>
            </div>
            <div className="text-center text-sm text-gray-700">
              Qty: {quantity}
            </div>
            <RemoveFromCartButton id={product.id} />
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-6">
        <strong className="text-lg">Total: ${total.toFixed(2)}</strong>
        <div className="flex gap-3">
          <button
            onClick={clear}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Clear cart
          </button>
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
