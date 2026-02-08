"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { RemoveFromCartButton } from "@/components/remove-from-cart-button";
import { useAuth } from "@/context/auth-context";
import Spinner from "@/components/Spinner";

export default function CartPage() {
  const {
    displayItems: items,
    total,
    clear,
    getStripeItems,
    updateQuantity,
    lastAction,
  } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (lastAction) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 1800);
      return () => clearTimeout(t);
    }
  }, [lastAction]);

  const formatEUR = (amount: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: getStripeItems(),
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      router.push(data.url);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-24 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mb-4 text-5xl">🛒</div>
        <h2 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4">
      {showToast && lastAction && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg animate-fadeIn">
          {lastAction.type === "add" && "Item added to cart"}
          {lastAction.type === "remove" && "Item removed from cart"}
          {lastAction.type === "update" && "Cart updated"}
          {lastAction.type === "clear" && "Cart cleared"}
        </div>
      )}
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Shopping Cart
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        {items.length} items in your cart
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Cart items */}
        <div className="md:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-6 border-b border-gray-100 py-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between animate-fadeIn"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatEUR(item.price)} · each
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-l-full text-gray-600 transition hover:bg-gray-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>

                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-r-full text-gray-600 transition hover:bg-gray-100 active:scale-95"
                  >
                    +
                  </button>
                </div>

                <RemoveFromCartButton productId={item.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="sticky top-28 h-fit rounded-3xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-8 shadow-md">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Order Summary
          </h3>

          <div className="mb-4 flex justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span>{formatEUR(total)}</span>
          </div>

          <div className="mb-6 flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="mb-6 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatEUR(total)}</span>
          </div>

          <button
            onClick={clear}
            className="mb-4 w-full text-sm text-gray-500 underline transition hover:text-gray-700"
          >
            Clear cart
          </button>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
          >
            {isLoading && (
              <span className="pointer-events-none">
                <Spinner />
              </span>
            )}
            <span>{isLoading ? "Redirecting…" : "Proceed to Checkout"}</span>
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Secure checkout · Taxes calculated at checkout · Powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
