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
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-gray-50">
      <div
        className={`w-full max-w-xl bg-white border border-black/5 rounded-3xl shadow-[0_30px_80px_-25px_rgba(0,0,0,0.25)] p-10 text-center transition-all duration-500 ${loading ? "opacity-90" : "opacity-100"}`}
      >
        {loading ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center animate-pulse">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-gray-600 text-base" aria-live="polite">
              Processing your order...
            </p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-semibold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 hover:shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)] active:scale-[0.98]"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-green-50 flex items-center justify-center shadow-inner">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              Payment Successful
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Thanks for your order! We’ve received your payment and your order
              is being processed.
            </p>
            {orderId && (
              <div className="bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 mb-8 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Order ID
                </p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 hover:shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)] active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
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
