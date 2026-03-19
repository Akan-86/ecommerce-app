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
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Ecommerce Store",
  description: "Premium fashion, tech and lifestyle products.",
};

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products`, {
    next: { revalidate: 60 },
  });
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
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black z-0">
        <Image
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop"
          alt="Shop hero"
          fill
          className="-z-10 object-cover opacity-25 scale-105"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)]" />
        {/* Emerald Glow Accent */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_35%_at_70%_20%,rgba(16,185,129,0.25),transparent_70%)]" />
        {/* Subtle Grain Texture */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-44">
          <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                ✨ New Season <span className="text-white/60">·</span> Free
                shipping over €100
              </span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05] animate-[fadeUp_0.8s_ease_forwards]">
                Shop smarter.
                <span className="block bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(5,150,105,0.45)]">
                  Discover better.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-gray-200 animate-[fadeUp_1s_ease_forwards] opacity-0">
                Premium products across fashion, tech, and lifestyle. Curated
                for quality and value.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-[fadeUp_1.2s_ease_forwards] opacity-0">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold btn-primary hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  Browse Products
                </Link>
                <Link
                  href="/products?sort=new"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:scale-[1.03] transition-all duration-300"
                >
                  New Arrivals
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl">
                <div>
                  <p className="text-2xl font-bold text-white">10K+</p>
                  <p className="text-xs text-white/60">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-xs text-white/60">Premium Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-xs text-white/60">Customer Support</p>
                </div>
              </div>
              <div className="mt-8 grid max-w-lg grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-white/80">
                <div className="flex items-center gap-2 text-sm">
                  <span>🚚</span> Fast delivery
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>🔒</span> Secure checkout
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>↩️</span> Easy returns
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10" />
              <div className="grid grid-cols-3 gap-4 p-6">
                {(products || []).slice(0, 6).map((p: any) => (
                  <div
                    key={p.id}
                    className="relative overflow-hidden rounded-2xl bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-[fadeUp_0.8s_ease_forwards] opacity-0"
                  >
                    {p.image || p.thumbnail ? (
                      <Image
                        src={p.image || p.thumbnail}
                        alt={p.title}
                        width={300}
                        height={400}
                        className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 animate-pulse transition-opacity duration-500">
          <span className="text-[10px] tracking-widest">SCROLL</span>
          <div className="mt-2 h-8 w-[2px] bg-white/40" />
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

      <Footer />
    </main>
  );
}
