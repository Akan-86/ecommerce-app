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
    if (!stripe || isSubmitting) return;

    if (!items || items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

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

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }

      // Only execute success logic if redirect call succeeds
      if (onSuccess) {
        await onSuccess();
      }

      // Fallback safety in case redirect does not navigate
      setIsSubmitting(false);
      onProcessing?.(false);
    } catch (err: any) {
      setError(
        err?.message || "Payment could not be initiated. Please try again."
      );
      setIsSubmitting(false);
      onProcessing?.(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
          Secure Checkout
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            Trusted
          </span>
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Payments are encrypted and processed securely via Stripe.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-700 shadow-sm flex items-start gap-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting || !items || items.length === 0}
        className={`w-full rounded-2xl bg-black px-6 py-3.5 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-gray-900 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 ${
          isSubmitting ? "animate-pulse" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Redirecting…
          </>
        ) : (
          "Proceed to secure payment"
        )}
      </button>

      <div className="text-center text-xs text-gray-400 pt-4 border-t border-black/5 flex flex-col gap-1">
        <span>🔒 SSL secure payment</span>
        <span>Powered by Stripe · 256-bit encryption</span>
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
