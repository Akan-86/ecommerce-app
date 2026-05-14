"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Check,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const hasProcessed = useRef(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!loading && !error) {
      // 🎉 Confetti burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.7 },
        });
      }, 300);

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push("/orders");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, error, router]);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId || hasProcessed.current) return;
    hasProcessed.current = true;

    const saveOrderAndClearCart = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Order API failed");
        }

        const data = await res.json();
        setOrderId(data.orderId || null);
        clearCart();
        setLoading(false);
      } catch (err) {
        console.error("Order save failed:", err);
        setError(
          "We received your payment, but failed to save the order. Please contact support."
        );
        setLoading(false);
      }
    };

    saveOrderAndClearCart();
  }, [sessionId, clearCart, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-6 py-20 dark:bg-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-[40px] border border-black/5 bg-white p-10 text-center shadow-[0_60px_180px_-50px_rgba(0,0,0,0.18)] transition-all duration-500 dark:border-white/10 dark:bg-neutral-950 sm:p-14 ${loading ? "opacity-90" : "opacity-100"}`}
      >
        {loading ? (
          <>
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/5">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
            </div>
            <p
              className="text-base leading-7 text-neutral-600 dark:text-neutral-300"
              aria-live="polite"
            >
              Finalizing your order securely...
            </p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/10 bg-red-500/10">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-red-600">
              Something went wrong
            </h1>
            <p className="mx-auto mb-8 max-w-md text-[15px] leading-7 text-neutral-600 dark:text-neutral-300">
              {error}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-[32px] border border-emerald-500/10 bg-emerald-500/10">
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)]" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Check size={34} strokeWidth={3} />
              </div>
            </div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
              <Sparkles size={14} />
              Payment Successful
            </div>

            <h1 className="mb-4 text-5xl font-semibold tracking-tight text-black dark:text-white sm:text-6xl">
              Order Confirmed
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-[15px] leading-8 text-neutral-600 dark:text-neutral-300 sm:text-base">
              Your order has been successfully placed. A confirmation email has
              been sent, and we’re already preparing your items for shipment.
            </p>

            <div className="mx-auto mb-8 grid max-w-xl gap-4 rounded-3xl border border-black/5 bg-black/[0.03] p-6 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={16} />
                <span>Secure payment</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Package size={16} />
                <span>Fast processing</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Sparkles size={16} />
                <span>Premium support</span>
              </div>
            </div>

            <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
              Redirecting you to your orders in{" "}
              <span className="font-semibold text-black dark:text-white">
                {redirectCountdown}s
              </span>
            </p>
            {orderId && (
              <div className="mx-auto mb-10 max-w-md rounded-3xl border border-black/10 bg-black/[0.02] px-6 py-5 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Order ID
                </p>
                <p className="break-all font-mono text-sm text-black dark:text-white">
                  {orderId}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center rounded-2xl bg-black px-7 py-4 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                Continue Shopping
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-7 py-4 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                View Orders
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
