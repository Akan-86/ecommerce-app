import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import TrustBar from "@/components/home/TrustBar";
import CategoryIcons from "@/components/home/CategoryIcons";
import PromoCards from "@/components/home/PromoCards";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import CategoryBanners from "@/components/home/CategoryBanners";
import NewsletterSection from "@/components/home/NewsletterSection";

import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import type { Product } from "@/lib/types";

import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Velora — Premium Modern Commerce",
  description:
    "Discover premium lifestyle, fashion, and technology essentials curated for modern living.",
};

export default async function Page() {
  let products: Product[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-app-flame-sigma.vercel.app"}/api/products`,
      {
        cache: "no-store",
      }
    );

    const data: unknown = await res.json();

    if (Array.isArray(data)) {
      products = data;
    } else {
      console.error("Invalid product data:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

  if (!products || products.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-black">
        <div className="rounded-[32px] border border-black/5 bg-white px-10 py-12 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-neutral-950">
          <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
            Products are coming soon.
          </h2>

          <p className="mt-4 max-w-md text-[15px] leading-7 text-neutral-500 dark:text-neutral-300">
            We’re currently preparing a premium curated collection for your next
            shopping experience.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-[#fafafa] text-black dark:bg-black dark:text-white">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      {/* HERO */}
      <section className="container-modern relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
              <Sparkles size={14} />
              Premium Modern Commerce
            </div>

            <h1
              className={`${playfair.className} max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl`}
            >
              Designed for modern living.
            </h1>

            <p className="mt-8 max-w-xl text-[17px] leading-8 text-neutral-600 dark:text-neutral-300 sm:text-lg">
              Discover premium lifestyle, fashion, and technology essentials
              curated for modern minimal living.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center rounded-2xl bg-black px-7 py-4 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                Shop Collection
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-7 py-4 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                About Velora
              </Link>
            </div>

            {/* TRUST INFO */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                  <Truck size={18} />
                </div>

                <h3 className="text-sm font-semibold text-black dark:text-white">
                  Fast Delivery
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-300">
                  Premium worldwide shipping experience.
                </p>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                  <ShieldCheck size={18} />
                </div>

                <h3 className="text-sm font-semibold text-black dark:text-white">
                  Secure Checkout
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-300">
                  Protected payments with trusted infrastructure.
                </p>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                  <Sparkles size={18} />
                </div>

                <h3 className="text-sm font-semibold text-black dark:text-white">
                  Curated Products
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-300">
                  Handpicked essentials designed for modern lifestyles.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-black/5 blur-3xl dark:bg-white/10" />

            <div className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white shadow-[0_60px_180px_-50px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-neutral-950">
              <div className="relative aspect-[4/5] overflow-hidden">
                {products?.[0]?.image ? (
                  <Image
                    src={products[0].image}
                    alt={products[0].title || "Featured product"}
                    fill
                    priority
                    className="object-cover transition duration-700 hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    Preview
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Featured Collection
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  {products?.[0]?.title || "Modern Essentials"}
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                  Minimal design. Premium materials. Built for everyday modern
                  life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <TrustBar />

      {/* CATEGORY ICONS */}
      <section className="container-modern py-6">
        <CategoryIcons />
      </section>

      {/* PROMO CARDS */}
      <section className="container-modern py-10">
        <PromoCards />
      </section>

      {/* CATEGORY GRID */}
      <section className="container-modern py-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Shop by Category
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
              Curated collections for every lifestyle.
            </h2>
          </div>
        </div>

        <CategoryGrid />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-modern py-14">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Featured Products
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
              Premium picks curated for modern living.
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-black transition hover:opacity-70 dark:text-white"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        <FeaturedProducts products={products} />
      </section>

      {/* BEST SELLERS */}
      <section className="container-modern py-14">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Best Sellers
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
              Most loved by our customers.
            </h2>
          </div>
        </div>

        <BestSellers products={products} />
      </section>

      {/* CATEGORY BANNERS */}
      <section className="container-modern py-10">
        <CategoryBanners />
      </section>

      {/* NEWSLETTER */}
      <section className="container-modern py-16">
        <NewsletterSection />
      </section>
    </main>
  );
}
