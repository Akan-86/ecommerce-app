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
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/products`, {
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
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-gray-50">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(600px_300px_at_80%_20%,rgba(99,102,241,0.15),transparent),radial-gradient(500px_250px_at_20%_60%,rgba(217,70,239,0.12),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-24 grid md:grid-cols-2 items-center gap-12">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
              ✨ Premium curated store
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
              Minimal products.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-fuchsia-600 bg-clip-text text-transparent">
                Maximum quality.
              </span>
            </h1>

            <p className="text-gray-500 text-lg max-w-md leading-relaxed">
              Carefully curated essentials for everyday life. Built for quality
              and simplicity with a premium touch.
            </p>

            <div className="flex gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white px-6 py-3 text-sm font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Shop now
              </Link>

              <Link
                href="/products?sort=new"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/80 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-white transition"
              >
                New arrivals
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="w-[380px] h-[380px] relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] border border-black/5 p-6">
              {products?.[0]?.image ? (
                <Image
                  src={products[0].image}
                  alt={products[0].title}
                  fill
                  className="object-contain drop-shadow-2xl"
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
