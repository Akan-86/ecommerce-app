"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import EmptyState from "@/components/ui/empty-state";

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
        className={`fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-250 ease-out z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-modal z-50 transform transition-all duration-250 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200">
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
        <div
          className={`flex-1 overflow-y-auto px-6 py-6 space-y-6 transition-all duration-500 ease-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {items.length === 0 ? (
            <div className="py-16">
              <EmptyState
                icon={<ShoppingBag size={26} />}
                title="Your cart is empty"
                description="Looks like you haven’t added anything yet. Explore products and start building your order."
                primaryAction={
                  <Link
                    href="/products"
                    onClick={close}
                    className="px-4 py-2 rounded-lg text-sm font-semibold btn-primary transition-all duration-250 active:scale-[0.97]"
                  >
                    Browse Products
                  </Link>
                }
              />
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl p-3 border border-transparent transition-all duration-250 hover:bg-brand-100 hover:border-brand-200"
                style={{
                  transitionDelay: `${index * 60}ms`,
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0px)" : "translateY(10px)",
                }}
              >
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
                      className="text-xs text-red-500 hover:underline transition active:scale-95"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-brand-200 rounded-lg overflow-hidden text-sm">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) return;
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                        className="px-3 py-1 hover:bg-gray-100 transition active:scale-95"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100 transition active:scale-95"
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
          <div className="border-t border-brand-200 px-6 py-6 space-y-5 bg-white">
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span
                className="text-lg font-semibold"
                style={{ color: "var(--brand-primary)" }}
              >
                ${total.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={close}
              className="block text-center px-5 py-3 rounded-xl text-sm font-semibold text-white btn-primary transition-all duration-250 hover:-translate-y-0.5 hover:shadow-card active:scale-95"
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
