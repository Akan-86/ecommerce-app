"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { RemoveFromCartButton } from "@/components/remove-from-cart-button";
import { useAuth } from "@/context/auth-context";
import Spinner from "@/components/Spinner";
import { ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

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

  const shippingProgress = useMemo(() => {
    return Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  }, [total]);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-24 max-w-xl rounded-[36px] border border-black/5 bg-white p-12 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-neutral-900">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/5">
          <ShoppingBag size={34} className="text-black dark:text-white" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
          {lang === "tr" ? "Sepetiniz boş" : "Your cart is empty"}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-neutral-500 dark:text-neutral-300">
          {lang === "tr"
            ? "Henüz hiçbir ürün eklemediniz."
            : "Looks like you haven’t added anything yet."}
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-black px-7 py-4 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          {lang === "tr" ? "Ürünleri incele" : "Browse products"}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-modern mt-20 pb-20">
      {showToast && lastAction && (
        <div className="animate-fadeIn fixed bottom-6 right-6 z-50 rounded-2xl border border-white/10 bg-black px-5 py-3 text-sm text-white shadow-2xl backdrop-blur">
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
      <h1 className="mb-3 text-5xl font-semibold tracking-tight text-black dark:text-white md:text-6xl">
        {lang === "tr" ? "Alışveriş Sepeti" : "Shopping Cart"}
      </h1>
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          {lang === "tr"
            ? `${items.length} ürün sepetinizde`
            : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-black transition hover:opacity-70 dark:text-white"
        >
          {lang === "tr" ? "Alışverişe devam et" : "Continue shopping"}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
        {/* Cart items */}
        <div className="rounded-[36px] border border-black/5 bg-white p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.12)] transition dark:border-white/10 dark:bg-neutral-900 sm:p-10">
          {items.map((item) => (
            <div
              key={item.id}
              className="animate-fadeIn flex flex-col gap-6 rounded-3xl border border-transparent py-6 transition hover:border-black/5 hover:bg-black/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-4"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/products/${item.id}`}
                  className="relative block h-24 w-24 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-950"
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
                    className="text-lg font-semibold tracking-tight text-black transition hover:opacity-70 dark:text-white"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">
                    {formatEUR(item.price)}{" "}
                    {lang === "tr" ? "· adet" : "· each"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-black dark:text-white">
                    {formatEUR(item.price * item.quantity)}{" "}
                    {lang === "tr" ? "toplam" : "total"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/5">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-l-full text-neutral-600 transition hover:bg-black/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-white/5"
                  >
                    −
                  </button>

                  <span className="w-12 text-center text-sm font-medium text-black dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-r-full text-neutral-600 transition hover:bg-black/5 active:scale-95 dark:text-neutral-300 dark:hover:bg-white/5"
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
        <div className="sticky top-28 h-fit rounded-[36px] border border-black/5 bg-white p-8 shadow-[0_50px_140px_-40px_rgba(0,0,0,0.18)] transition dark:border-white/10 dark:bg-neutral-900 sm:p-10">
          <h3 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-white">
            {lang === "tr" ? "Sipariş Özeti" : "Order Summary"}
          </h3>
          {total < FREE_SHIPPING_THRESHOLD && (
            <div className="mb-6 rounded-3xl border border-black/5 bg-black/[0.03] p-5 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
              {lang === "tr"
                ? `${formatEUR(FREE_SHIPPING_THRESHOLD - total)} daha harcayın`
                : `Spend ${formatEUR(FREE_SHIPPING_THRESHOLD - total)}`}{" "}
              {lang === "tr"
                ? "daha harcayın ve ücretsiz kargoyu açın."
                : "more to unlock free shipping."}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-black transition-all dark:bg-white"
                  style={{
                    width: `${shippingProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
          {total >= FREE_SHIPPING_THRESHOLD && (
            <div className="mb-6 flex items-center gap-3 rounded-3xl border border-emerald-500/10 bg-emerald-500/10 p-5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {lang === "tr"
                ? "🎉 Ücretsiz kargo kazandınız!"
                : "🎉 You unlocked free shipping!"}
            </div>
          )}

          <div className="mb-4 flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
            <span>{lang === "tr" ? "Ara Toplam" : "Subtotal"}</span>
            <span>{formatEUR(total)}</span>
          </div>

          <div className="mb-7 flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <span>{lang === "tr" ? "Kargo" : "Shipping"}</span>
            <span>
              {lang === "tr"
                ? "Ödeme sırasında hesaplanır"
                : "Calculated at checkout"}
            </span>
          </div>

          <div className="mb-4 flex justify-between border-t border-black/10 pt-6 text-xl font-semibold tracking-tight text-black dark:border-white/10 dark:text-white">
            <span>{lang === "tr" ? "Toplam" : "Total"}</span>
            <span>{formatEUR(total)}</span>
          </div>

          <div className="mb-7 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>{lang === "tr" ? "Tahmini toplam" : "Estimated total"}</span>
            <span>{formatEUR(total)}</span>
          </div>

          <button
            onClick={clear}
            className="mb-5 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-black/5 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
          >
            {lang === "tr" ? "Sepeti temizle" : "Clear cart"}
          </button>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
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
              {!isLoading && (
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </span>
          </button>

          <div className="mt-8 space-y-4 rounded-3xl border border-black/5 bg-black/[0.03] p-5 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              <p>{lang === "tr" ? "Güvenli ödeme" : "Secure checkout"}</p>
            </div>
            <div className="flex items-center gap-3">
              <ArrowRight size={18} />
              <p>
                {lang === "tr"
                  ? "💳 Stripe ile korunur"
                  : "💳 Payments powered by Stripe"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={18} />
              <p>
                {lang === "tr"
                  ? "📦 Hızlı gönderim"
                  : "📦 Fast worldwide shipping"}
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-black/10 pt-5 text-center text-xs text-neutral-400 dark:border-white/10 dark:text-neutral-500">
            <p>🚚 Free returns within 30 days</p>
            <p>⭐ Trusted by 10,000+ customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
