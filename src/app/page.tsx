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
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold leading-tight text-neutral-900 dark:text-white">
              Designed for modern living
            </h1>

            <p className="text-neutral-500 max-w-md">
              Minimal, functional and premium products curated for everyday
              life.
            </p>

            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-md text-sm font-medium"
              >
                Shop now
              </Link>

              <Link
                href="/products"
                className="border border-neutral-200 dark:border-white/20 px-6 py-3 rounded-md text-sm"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden">
            {products?.[0]?.image ? (
              <Image
                src={products[0].image}
                alt={products[0].title || "Featured product"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-neutral-400 text-sm">
                Preview
              </div>
            )}
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
