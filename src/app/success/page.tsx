"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

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
              className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 hover:shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)] active:scale-[0.98]"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-8 h-24 w-24 rounded-[2rem] bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.08),0_10px_30px_rgba(0,0,0,0.08)] animate-[scaleIn_0.4s_ease-out]">
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

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
              Order Confirmed
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 max-w-md mx-auto">
              Your order has been successfully placed. A confirmation email has
              been sent, and we’re already preparing your items for shipment.
            </p>

            <p className="text-xs text-gray-400 mb-6">
              🔒 Secure payment · 📦 Fast processing · 💬 24/7 support
            </p>

            <p className="text-sm text-gray-400 mb-8">
              Redirecting you to your orders in{" "}
              <span className="font-semibold text-gray-800">
                {redirectCountdown}s
              </span>
            </p>
            {orderId && (
              <div className="bg-gradient-to-b from-gray-50 to-white border border-black/5 rounded-2xl py-5 px-6 mb-10 shadow-lg">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Order ID
                </p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-black px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-900 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6)] active:scale-[0.97]"
              >
                Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] active:scale-[0.97]"
              >
                View Orders
              </Link>
              <button
                onClick={() => router.push("/orders")}
                className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-700 hover:shadow-xl active:scale-[0.97]"
              >
                Go to Orders Now
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
