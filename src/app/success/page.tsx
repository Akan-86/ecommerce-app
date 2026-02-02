"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";

export default function SuccessPage() {
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

        clearCart();
      } catch (error) {
        console.error("Order save failed:", error);
      }
    };

    saveOrderAndClearCart();
  }, [sessionId, clearCart]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Payment Successful
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! Your order has been placed successfully.
      </p>
      <button
        onClick={() => router.push("/")}
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </main>
  );
}
