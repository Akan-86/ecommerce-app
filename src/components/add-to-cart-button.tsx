"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useState } from "react";
const lang = "en";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
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
        className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg active:scale-[0.95] flex items-center justify-center gap-2 w-full hover:shadow-xl hover:-translate-y-[2px] ${state === "loading" ? "opacity-90" : ""}`}
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
        {state === "idle" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.64L23 6H6" />
          </svg>
        )}
        {state === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-4 w-4 animate-[pop_0.3s_ease]"
          >
            <path d="M20 6L9 17l-5-5" />
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
        <div className="fixed bottom-6 right-6 bg-black text-white text-sm px-5 py-3 rounded-xl shadow-2xl animate-[toastIn_0.4s_ease]">
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-4 w-4"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {lang === "tr" ? "Ürün sepete eklendi" : "Product added to cart"}
          </span>
        </div>
      )}
    </>
  );
}

/* Add to globals.css:

@keyframes toastIn {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

*/
