"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const handleAdd = async () => {
    if (state !== "idle") return;

    setState("loading");

    // Simulate slight delay for smoother UX feel
    setTimeout(() => {
      add(product);
      window.dispatchEvent(new CustomEvent("cart:open"));
      setState("success");

      setTimeout(() => {
        setState("idle");
      }, 1500);
    }, 400);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={state === "loading"}
      className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg active:scale-[0.97] flex items-center justify-center gap-2 ${
        state === "success" ? "text-white" : "text-white"
      }`}
      style={{
        backgroundColor:
          state === "success" ? "var(--brand-primary)" : "var(--brand-primary)",
        boxShadow:
          state === "success" ? "0 0 0 4px rgba(5,150,105,0.15)" : undefined,
      }}
    >
      {state === "loading" && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}

      {state === "success"
        ? "Added ✓"
        : state === "loading"
          ? "Adding..."
          : "Add to Cart"}
    </button>
  );
}
