"use client";

import { useCart } from "@/context/cart-context";

export function RemoveFromCartButton({ id }: { id: number }) {
  const { removeOne, removeAll } = useCart();
  return (
    <div className="flex gap-2">
      <button
        onClick={() => removeOne(id)}
        className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
      >
        — 1
      </button>
      <button
        onClick={() => removeAll(id)}
        className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
      >
        Remove
      </button>
    </div>
  );
}
