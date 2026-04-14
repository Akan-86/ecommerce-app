"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/context/toast-context";

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const { addToast } = useToast();

  const handleOrderSuccess = async () => {
    if (!user || processing) return;

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
      addToast({ type: "success", message: "Order placed successfully" });
      router.push("/success");
    } catch (error) {
      console.error("Order creation failed:", error);
      addToast({ type: "error", message: "Payment failed. Please try again." });
      setProcessing(false);
    }
  };

  /* ---------------- Loading & Auth State ---------------- */
  if (loading) {
    return (
      <div className="mt-40 flex flex-col items-center gap-4 text-sm text-gray-500">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span aria-live="polite">Preparing secure checkout…</span>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
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
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 lg:py-32 fade-in animate-[fadeIn_0.6s_ease]">
      {processing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 text-sm text-gray-700">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            <span>Processing your order securely…</span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
          Secure Checkout
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Complete your purchase with confidence.
        </p>
      </div>

      <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-center animate-[fadeIn_0.8s_ease]">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[11px] bg-black dark:bg-white dark:text-black">
            1
          </span>
          Cart
        </div>
        <div className="h-px w-10 bg-gray-300" />
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[11px] bg-black dark:bg-white dark:text-black">
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

      <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-3">
        {/* Checkout Form */}
        <section className="lg:col-span-2 rounded-3xl border border-black/5 bg-white p-6 sm:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.25)]">
          <CheckoutForm
            items={items}
            userId={user.uid}
            onProcessing={setProcessing}
            onSuccess={handleOrderSuccess}
          />

          <div className="mt-12 flex items-center gap-2 text-sm text-gray-600 border-t border-black/5 pt-6">
            <span>🔒</span>
            <span>SSL secure payment · No card data stored</span>
          </div>
        </section>

        {/* Order Summary */}
        <aside className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-[0_45px_120px_-40px_rgba(0,0,0,0.35)] lg:sticky lg:top-32 h-fit transition-all duration-300 hover:shadow-[0_60px_140px_-40px_rgba(0,0,0,0.35)]">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Order Summary
          </h2>

          <p className="mb-6 text-xs text-gray-400">
            {items.reduce((sum, item) => sum + item.quantity, 0)} items in cart
          </p>

          <div className="space-y-5 text-sm text-gray-700 divide-y divide-black/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 pt-4 first:pt-0 transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl px-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-12 w-12 rounded-md object-cover border border-black/5"
                  />

                  <span className="truncate">
                    {item.title}
                    <span className="block text-xs text-gray-400">
                      Qty {item.quantity}
                    </span>
                  </span>
                </div>

                <span className="font-medium whitespace-nowrap">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex justify-between border-t border-black/10 pt-6 sm:pt-8 text-lg sm:text-xl font-semibold text-gray-900 items-center">
            <span>Total</span>
            <span className="text-gray-900 dark:text-white">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(total)}
            </span>
          </div>

          <div className="mt-10 rounded-3xl border border-black/5 bg-white dark:bg-black p-6 text-sm text-gray-600 space-y-3 shadow-md hover:shadow-lg transition-all duration-300">
            <p>✔ Free returns within 14 days</p>
            <p>✔ Fast & secure checkout</p>
            <p className="pt-2 text-gray-400">Powered by Stripe</p>
          </div>

          <Link
            href={processing ? "#" : "/cart"}
            className={`mt-8 block text-center text-sm font-medium tracking-wide link-accent transition-all duration-300 hover:opacity-70 ${processing ? "pointer-events-none opacity-40" : ""}`}
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
