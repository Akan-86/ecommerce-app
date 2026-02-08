"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    window.dispatchEvent(new CustomEvent("cart:open"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleAdd}
      className={`px-5 py-3 rounded-lg text-sm font-bold transition shadow-lg active:scale-[0.98] ${
        added
          ? "bg-emerald-600 text-white"
          : "bg-black text-white hover:bg-black/90"
      }`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
