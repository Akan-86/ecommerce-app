"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { RemoveFromCartButton } from "@/components/remove-from-cart-button";
import { useAuth } from "@/context/auth-context";
import Spinner from "@/components/Spinner";

const lang = "en";
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
  const FREE_SHIPPING_THRESHOLD = 100;

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
      alert(
        lang === "tr"
          ? "Ödeme sırasında bir hata oluştu."
          : "Something went wrong during checkout."
      );
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
          {lang === "tr" ? "Sepetiniz boş" : "Your cart is empty"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {lang === "tr"
            ? "Henüz hiçbir ürün eklemediniz."
            : "Looks like you haven’t added anything yet."}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          {lang === "tr" ? "Ürünleri incele" : "Browse products"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-6xl px-4">
      {showToast && lastAction && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg animate-fadeIn">
          {lastAction.type === "add" &&
            (lang === "tr" ? "Ürün sepete eklendi" : "Item added to cart")}
          {lastAction.type === "remove" &&
            (lang === "tr"
              ? "Ürün sepetten kaldırıldı"
              : "Item removed from cart")}
          {lastAction.type === "update" &&
            (lang === "tr" ? "Sepet güncellendi" : "Cart updated")}
          {lastAction.type === "clear" &&
            (lang === "tr" ? "Sepet temizlendi" : "Cart cleared")}
        </div>
      )}
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        {lang === "tr" ? "Alışveriş Sepeti" : "Shopping Cart"}
      </h1>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {lang === "tr"
            ? `${items.length} ürün sepetinizde`
            : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
        </p>
        <Link
          href="/products"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {lang === "tr" ? "Alışverişe devam et" : "Continue shopping"}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Cart items */}
        <div className="md:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-6 border-b border-gray-100 py-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between animate-fadeIn"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/products/${item.id}`}
                  className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100 block"
                >
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div>
                  <Link
                    href={`/products/${item.id}`}
                    className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatEUR(item.price)}{" "}
                    {lang === "tr" ? "· adet" : "· each"}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatEUR(item.price * item.quantity)}{" "}
                    {lang === "tr" ? "toplam" : "total"}
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
            {lang === "tr" ? "Sipariş Özeti" : "Order Summary"}
          </h3>
          {total < FREE_SHIPPING_THRESHOLD && (
            <div className="mb-5 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700">
              {lang === "tr"
                ? `${formatEUR(FREE_SHIPPING_THRESHOLD - total)} daha harcayın`
                : `Spend ${formatEUR(FREE_SHIPPING_THRESHOLD - total)}`}{" "}
              {lang === "tr"
                ? "daha harcayın ve ücretsiz kargoyu açın."
                : "more to unlock free shipping."}
              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-indigo-100">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{
                    width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
          {total >= FREE_SHIPPING_THRESHOLD && (
            <div className="mb-5 rounded-lg bg-green-50 p-3 text-xs font-medium text-green-700">
              {lang === "tr"
                ? "🎉 Ücretsiz kargo kazandınız!"
                : "🎉 You unlocked free shipping!"}
            </div>
          )}

          <div className="mb-4 flex justify-between text-sm text-gray-700">
            <span>{lang === "tr" ? "Ara Toplam" : "Subtotal"}</span>
            <span>{formatEUR(total)}</span>
          </div>

          <div className="mb-6 flex justify-between text-sm text-gray-500">
            <span>{lang === "tr" ? "Kargo" : "Shipping"}</span>
            <span>
              {lang === "tr"
                ? "Ödeme sırasında hesaplanır"
                : "Calculated at checkout"}
            </span>
          </div>

          <div className="mb-3 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold text-gray-900">
            <span>{lang === "tr" ? "Toplam" : "Total"}</span>
            <span>{formatEUR(total)}</span>
          </div>

          <div className="mb-6 flex justify-between text-xs text-gray-500">
            <span>{lang === "tr" ? "Tahmini toplam" : "Estimated total"}</span>
            <span>{formatEUR(total)}</span>
          </div>

          <button
            onClick={clear}
            className="mb-4 w-full text-sm text-gray-500 underline transition hover:text-gray-700"
          >
            {lang === "tr" ? "Sepeti temizle" : "Clear cart"}
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
            <span>
              {isLoading
                ? lang === "tr"
                  ? "Yönlendiriliyor…"
                  : "Redirecting…"
                : lang === "tr"
                  ? "Ödemeye geç"
                  : "Proceed to Checkout"}
            </span>
          </button>

          <div className="mt-5 space-y-2 text-center text-xs text-gray-500">
            <p>{lang === "tr" ? "🔒 Güvenli ödeme" : "🔒 Secure checkout"}</p>
            <p>
              {lang === "tr"
                ? "💳 Stripe ile korunur"
                : "💳 Payments powered by Stripe"}
            </p>
            <p>
              {lang === "tr"
                ? "📦 Hızlı gönderim"
                : "📦 Fast worldwide shipping"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
