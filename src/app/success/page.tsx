"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const hasProcessed = useRef(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!loading && !error) {
      // 🎉 Confetti burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.7 },
        });
      }, 300);

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push("/orders");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, error, router]);

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
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-white">
      <div
        className={`w-full max-w-lg bg-white border border-black/10 rounded-2xl p-10 text-center transition-all duration-500 ${loading ? "opacity-90" : "opacity-100"}`}
      >
        {loading ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-gray-600 text-base" aria-live="polite">
              Finalizing your order securely...
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
              className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="bg-green-50 rounded-2xl flex items-center justify-center h-24 w-24 mx-auto mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="h-10 w-10 text-green-600"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
              Order Confirmed
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
              Your order has been successfully placed. A confirmation email has
              been sent, and we’re already preparing your items for shipment.
            </p>

            <p className="text-xs text-gray-400 mb-6">
              🔒 Secure payment · 📦 Fast processing · 💬 24/7 support
            </p>

            <p className="text-xs text-gray-400 mb-6">
              Redirecting you to your orders in{" "}
              <span className="font-semibold text-gray-800">
                {redirectCountdown}s
              </span>
            </p>
            {orderId && (
              <div className="border border-black/10 rounded-xl py-4 px-5 mb-8 mx-auto max-w-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Order ID
                </p>
                <p className="font-mono text-sm break-all">{orderId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link
                href="/products"
                className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="rounded-md border border-black/10 px-6 py-2.5 text-sm font-medium text-center"
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
