"use client";

import { useCart } from "@/context/cart-context";
import { RemoveFromCartButton } from "@/components/remove-from-cart-button";

export default function CartPage() {
  const { items, total, clear } = useCart();

  if (items.length === 0) {
    return <p className="text-center py-8">Your cart is empty.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sepet</h1>
      <ul className="divide-y divide-gray-200">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="grid grid-cols-[64px_1fr_auto_auto] items-center gap-4 py-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <div className="font-medium">{product.title}</div>
              <div className="text-gray-600 text-sm">{product.price} $</div>
            </div>
            <div className="text-center">Miktar: {quantity}</div>
            <RemoveFromCartButton id={product.id} />
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-6">
        <strong className="text-lg">Toplam: {total.toFixed(2)} $</strong>
        <button
          onClick={clear}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear your cart
        </button>
      </div>
    </div>
  );
}
