"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartDrawer() {
  const { items, isOpen, close, remove, updateQuantity, total } = useCart();

  useEffect(() => {
    const handleOpen = () => close(false);
    window.addEventListener("cart:close", handleOpen);
    return () => window.removeEventListener("cart:close", handleOpen);
  }, [close]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag size={18} />
            Your Cart
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
              <ShoppingBag size={36} className="mb-4 opacity-40" />
              <p className="font-semibold text-gray-700">Your cart is empty</p>
              <p className="text-sm">Add products to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-black/10 rounded-lg overflow-hidden text-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black/5 px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span style={{ color: "var(--brand-primary)" }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={close}
              className="block text-center px-5 py-3 rounded-xl text-sm font-semibold text-white btn-primary"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}
