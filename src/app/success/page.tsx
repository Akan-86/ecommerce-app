"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
      } catch (error) {
        console.error("Order save failed:", error);
        setError(
          "We received your payment, but failed to save the order. Please contact support."
        );
        setLoading(false);
      }
    };

    saveOrderAndClearCart();
  }, [sessionId, clearCart]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      {loading ? (
        <p className="text-gray-600">Processing your order...</p>
      ) : error ? (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ⚠️ Something went wrong
          </h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            ✅ Payment Successful
          </h1>
          <p className="text-gray-700 mb-2">
            Thank you for your purchase! Your order has been placed
            successfully.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <button
            onClick={() => router.push("/")}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </>
      )}
    </main>
  );
}
