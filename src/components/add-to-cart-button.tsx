"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useState } from "react";
import { useLanguage } from "@/app/layout";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const { lang } = useLanguage();
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const [showToast, setShowToast] = useState(false);

  const handleAdd = async () => {
    if (state !== "idle") return;

    setState("loading");

    // Simulate slight delay for smoother UX feel
    setTimeout(() => {
      const normalizedProduct = {
        ...product,
        image:
          (product as any).image ||
          (product as any).thumbnail ||
          (product as any).imageUrl,
      };

      add(normalizedProduct as Product);
      window.dispatchEvent(new CustomEvent("cart:open"));
      setState("success");
      setShowToast(true);

      setTimeout(() => {
        setState("idle");
        setShowToast(false);
      }, 1500);
    }, 400);
  };

  return (
    <>
      <button
        onClick={handleAdd}
        disabled={state === "loading"}
        className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg active:scale-[0.97] flex items-center justify-center gap-2 ${
          state === "success" ? "text-white" : "text-white"
        }`}
        style={{
          backgroundColor:
            state === "success"
              ? "var(--brand-primary)"
              : "var(--brand-primary)",
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
          ? lang === "tr"
            ? "Eklendi ✓"
            : "Added ✓"
          : state === "loading"
            ? lang === "tr"
              ? "Ekleniyor..."
              : "Adding..."
            : lang === "tr"
              ? "Sepete ekle"
              : "Add to Cart"}
      </button>
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {lang === "tr" ? "✓ Ürün sepete eklendi" : "✓ Product added to cart"}
        </div>
      )}
    </>
  );
}
