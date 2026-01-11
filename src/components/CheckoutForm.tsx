"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type CheckoutFormProps = {
  items: any[];
  userId: string;
};

function CheckoutForm({ items, userId }: CheckoutFormProps) {
  const stripe = useStripe();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, userId }),
      });

      if (!res.ok) {
        throw new Error("Unable to start checkout. Please try again.");
      }

      const { sessionId } = await res.json();

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Secure Checkout</h2>
        <p className="text-sm text-gray-500">
          Payments are encrypted and processed securely via Stripe.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full rounded-lg bg-black px-6 py-3 text-white font-medium transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Processing payment…" : "Proceed to payment"}
      </button>

      <div className="text-center text-xs text-gray-400">
        🔒 SSL secure payment · Powered by Stripe
      </div>
    </form>
  );
}

export default function CheckoutWrapper(props: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
