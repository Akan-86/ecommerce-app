"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login?redirect=/checkout");
      } else if (items.length === 0) {
        router.replace("/cart");
      }
    }
  }, [user, loading, router, items.length]);

  const handleOrderSuccess = async () => {
    if (!user) return;

    try {
      setProcessing(true);

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        email: user.email,
        items,
        total,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      clearCart();
      router.push("/success");
    } catch (error) {
      console.error("Order creation failed:", error);
      setProcessing(false);
    }
  };

  /* ---------------- Loading State ---------------- */
  if (loading || !user) {
    return (
      <div className="mt-40 flex flex-col items-center gap-4 text-sm text-gray-500">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span aria-live="polite">Preparing secure checkout…</span>
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
    <div
      className="relative mx-auto max-w-6xl px-4 py-24 fade-in"
      style={{ backgroundColor: "var(--brand-bg-soft)" }}
    >
      {processing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-sm text-gray-700">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            <span>Redirecting to secure payment…</span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Secure Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete your purchase with confidence.
        </p>
      </div>

      <div className="mb-14 flex items-center justify-center gap-6 text-xs font-medium">
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--brand-primary)" }}
        >
          <span
            className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[11px]"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            1
          </span>
          Cart
        </div>
        <div className="h-px w-10 bg-gray-300" />
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--brand-primary)" }}
        >
          <span
            className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[11px]"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            2
          </span>
          Checkout
        </div>
        <div className="h-px w-10 bg-gray-300" />
        <div className="flex items-center gap-2 text-gray-400">
          <span className="h-6 w-6 rounded-full flex items-center justify-center border border-gray-300 text-[11px]">
            3
          </span>
          Confirmation
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Checkout Form */}
        <section className="lg:col-span-2 rounded-2xl border bg-white p-8 shadow-sm">
          <CheckoutForm
            items={items}
            userId={user.uid}
            onProcessing={setProcessing}
            onSuccess={handleOrderSuccess}
          />

          <div className="mt-10 flex items-center gap-2 text-xs text-gray-500">
            <span>🔒</span>
            <span>SSL secure payment · No card data stored</span>
          </div>
        </section>

        {/* Order Summary */}
        <aside className="rounded-2xl border bg-white p-6 shadow-lg sticky top-28 h-fit">
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

          <div className="mt-6 flex justify-between border-t pt-6 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span style={{ color: "var(--brand-primary)" }}>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(total)}
            </span>
          </div>

          <div className="mt-8 rounded-2xl border border-black/5 bg-gray-50 p-5 text-xs text-gray-600 space-y-2">
            <p>✔ Free returns within 14 days</p>
            <p>✔ Fast & secure checkout</p>
            <p className="pt-2 text-gray-400">Powered by Stripe</p>
          </div>

          <Link
            href="/cart"
            className="mt-6 block text-center text-sm link-accent transition"
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
