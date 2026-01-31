"use client";

import { useCart } from "@/context/useCart";
import type { Product } from "@/lib/types";

export function CartItem({
  product,
}: {
  product: Product & { quantity: number };
}) {
  const { remove } = useCart();

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <p className="font-semibold">{product.title}</p>
        <p className="text-sm text-gray-500">
          {product.quantity} × ${product.price}
        </p>
      </div>
      <button
        onClick={() => remove(product.id)}
        className="text-red-500 hover:underline text-sm"
      >
        Remove
      </button>
    </div>
  );
}
