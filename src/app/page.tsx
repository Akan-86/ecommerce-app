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

export const metadata = {
  title: "Ecommerce Store",
  description: "Premium fashion, tech and lifestyle products.",
};

export default async function Page() {
  const res = await fetch("/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API ERROR:", await res.text());
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">API Error</p>
      </main>
    );
  }

  const products = await res.json();

  if (!Array.isArray(products)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Unable to load products.</p>
      </main>
    );
  }

  return (
    <main className="relative z-0">
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-24 grid md:grid-cols-2 items-center gap-12">
          {/* LEFT */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Minimal products.
              <br />
              Maximum quality.
            </h1>

            <p className="text-gray-500 text-lg max-w-md">
              Carefully curated essentials for everyday life. Built for quality
              and simplicity.
            </p>

            <div className="flex gap-4">
              <Link href="/products" className="btn btn-primary-modern">
                Shop now
              </Link>

              <Link
                href="/products?sort=new"
                className="btn btn-secondary-modern"
              >
                New arrivals
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="w-[360px] h-[360px] relative">
              {products?.[0]?.image ? (
                <Image
                  src={products[0].image}
                  alt={products[0].title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                  Product preview
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
