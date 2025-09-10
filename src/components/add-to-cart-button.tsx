"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add(product)}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Add to Cart
    </button>
  );
}
