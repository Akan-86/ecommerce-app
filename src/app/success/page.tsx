"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const hasProcessed = useRef(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId || hasProcessed.current) return;
    hasProcessed.current = true;

    const saveOrderAndClearCart = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Order API failed");
        }

        const data = await res.json();
        setOrderId(data.orderId || null);
        clearCart();
        setLoading(false);
      } catch (err) {
        console.error("Order save failed:", err);
        setError(
          "We received your payment, but failed to save the order. Please contact support."
        );
        setLoading(false);
      }
    };

    saveOrderAndClearCart();
  }, [sessionId, clearCart, router]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div
        className={`w-full max-w-lg bg-white border rounded-2xl shadow-lg p-8 text-center ${loading ? "opacity-90" : ""}`}
      >
        {loading ? (
          <>
            <div className="animate-pulse text-4xl mb-4">⏳</div>
            <p className="text-gray-600" aria-live="polite">
              Processing your order...
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful
            </h1>
            <p className="text-gray-600 mb-4">
              Thanks for your order! We’ve received your payment and your order
              is being processed.
            </p>
            {orderId && (
              <div className="bg-gray-50 border rounded-lg py-3 px-4 mb-6">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-yellow-300"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                View Orders
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
