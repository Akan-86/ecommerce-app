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

import type { Product } from "@/lib/types";

import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ecommerce Store",
  description: "Premium fashion, tech and lifestyle products.",
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
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">No products available.</p>
      </main>
    );
  }

  return (
    <main className="relative z-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-neutral-900 dark:to-black" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-600/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-32 md:py-40 grid md:grid-cols-2 items-center gap-16">
          {/* LEFT */}
          <div className="space-y-6 max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-wider text-gray-500 dark:text-white/60 uppercase">
              Premium Collection
            </span>

            <h1
              className={`${playfair.className} text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white leading-[1.02]`}
            >
              Next generation
              <br />
              essentials
            </h1>

            <p className="text-gray-600 dark:text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
              Engineered for performance and refined for everyday living. A new
              standard of modern products.
            </p>

            <div className="flex gap-4 pt-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-sm font-semibold tracking-wide shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
              >
                Shop now
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/20 px-8 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                Explore
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-gray-500 dark:text-white/60">
              <div>✔ Free shipping</div>
              <div>✔ 30-day returns</div>
              <div>✔ Secure checkout</div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center relative">
            <div className="relative w-[420px] sm:w-[520px] md:w-[600px] aspect-square rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 backdrop-blur-sm bg-white dark:bg-black shadow-[0_60px_140px_rgba(0,0,0,0.35)] ring-1 ring-white/10 dark:ring-white/10 transition-all duration-500 hover:scale-[1.05]">
              {products?.[0]?.image ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 opacity-60 pointer-events-none" />
                  <Image
                    src={products[0].image}
                    alt={products[0].title || "Featured product"}
                    fill
                    priority
                    className="object-cover"
                  />
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                  Preview
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <CategoryIcons />

      <PromoCards />

      <CategoryGrid />

      <FeaturedProducts products={products} />

      <BestSellers products={products} />

      <CategoryBanners />

      <NewsletterSection />
    </main>
  );
}
