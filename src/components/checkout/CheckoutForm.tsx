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
  onProcessing?: (state: boolean) => void;
  onSuccess?: () => Promise<void> | void;
};

function CheckoutForm({
  items,
  userId,
  onProcessing,
  onSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;

    setIsSubmitting(true);
    setError(null);
    onProcessing?.(true);

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

      // Create order in Firestore before redirect
      if (onSuccess) {
        await onSuccess();
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please retry.");
      setIsSubmitting(false);
      onProcessing?.(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          Secure Checkout
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Payments are encrypted and processed securely via Stripe.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className={`w-full rounded-2xl bg-black px-6 py-3.5 text-white font-medium tracking-wide transition-all duration-300 hover:bg-gray-900 hover:shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
          isSubmitting ? "animate-pulse" : ""
        }`}
      >
        {isSubmitting ? "Processing payment…" : "Proceed to payment"}
      </button>

      <div className="text-center text-xs text-gray-400 pt-4 border-t border-black/5">
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
