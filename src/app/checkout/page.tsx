"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Link from "next/link";

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { items, total } = useCart();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login?redirect=/checkout");
      } else if (items.length === 0) {
        router.replace("/cart");
      }
    }
  }, [user, loading, router, items.length]);

  /* ---------------- Loading State ---------------- */
  if (loading || !user) {
    return (
      <div className="mt-40 flex flex-col items-center gap-4 text-sm text-gray-500">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span>Preparing secure checkout…</span>
      </div>
    );
  }

  /* ---------------- Empty State ---------------- */
  if (!items.length) {
    return (
      <div className="mt-40 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Add some products before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
        >
          Browse products
        </Link>
      </div>
    );
  }

  /* ---------------- Checkout Layout ---------------- */
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Secure Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete your purchase with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Checkout Form */}
        <section className="lg:col-span-2 rounded-2xl border bg-white p-8 shadow-sm">
          <CheckoutForm items={items} userId={user.uid} />

          <div className="mt-10 flex items-center gap-2 text-xs text-gray-500">
            <span>🔒</span>
            <span>SSL secure payment · No card data stored</span>
          </div>
        </section>

        {/* Order Summary */}
        <aside className="rounded-2xl border bg-gradient-to-b from-gray-50 to-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-900">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start gap-3"
              >
                <span className="truncate">
                  {item.title}
                  <span className="block text-xs text-gray-400">
                    Qty {item.quantity}
                  </span>
                </span>
                <span className="font-medium whitespace-nowrap">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t pt-4 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(total)}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-white p-4 text-xs text-gray-500 space-y-1">
            <p>✔ Free returns within 14 days</p>
            <p>✔ Fast & secure checkout</p>
            <p className="pt-2 text-gray-400">Powered by Stripe</p>
          </div>

          <Link
            href="/cart"
            className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
