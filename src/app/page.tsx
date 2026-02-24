import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product-card";

export default async function Page() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  const products = await res.json();

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
        <div className="mx-auto max-w-7xl px-6 py-32 lg:py-44">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                ✨ New Season <span className="text-white/60">·</span> Free
                shipping over €100
              </span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Shop smarter.
                <span className="block bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(5,150,105,0.45)]">
                  Discover better.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-gray-200">
                Premium products across fashion, tech, and lifestyle. Curated
                for quality and value.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
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
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 text-white/80">
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
                    className="relative overflow-hidden rounded-2xl bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 animate-pulse">
          <span className="text-[10px] tracking-widest">SCROLL</span>
          <div className="mt-2 h-8 w-[2px] bg-white/40" />
        </div>
      </section>

      {/* PROMO CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-md transition hover:shadow-xl">
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
            <p className="text-xs font-semibold text-emerald-600">DEALS</p>
            <h3 className="mt-2 text-lg font-bold">Big spend, big save</h3>
            <p className="mt-1 text-sm text-gray-600">
              High‑ticket items with special offers
            </p>
            <Link
              href="/products?promo=deals"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-900"
            >
              Shop deals →
            </Link>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-md transition hover:shadow-xl">
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
            <p className="text-xs font-semibold text-emerald-600">
              RECOMMENDED
            </p>
            <h3 className="mt-2 text-lg font-bold">Continue shopping</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on your recent views
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center rounded-full px-6 py-2 text-sm font-semibold btn-primary"
            >
              View items →
            </Link>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-md transition hover:shadow-xl">
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
            <p className="text-xs font-semibold text-emerald-600">DAILY</p>
            <h3 className="mt-2 text-lg font-bold">Daily essentials</h3>
            <p className="mt-1 text-sm text-gray-600">Save on everyday needs</p>
            <Link
              href="/products?promo=daily"
              className="mt-4 inline-flex items-center rounded-full px-6 py-2 text-sm font-semibold btn-primary"
            >
              Start now →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent" />

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              Featured Collection
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Curated for You
            </h2>
            <p className="mt-3 max-w-xl text-sm text-gray-600">
              Hand‑picked premium products selected for quality, design and
              everyday performance.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            View all products →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {(products || []).slice(0, 10).map((p: any, index: number) => (
            <div
              key={p.id}
              className="animate-[fadeUp_0.6s_ease_forwards] opacity-0"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY BANNERS */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white">
            <h3 className="text-2xl font-bold">Tech & Gadgets</h3>
            <p className="mt-2 text-gray-300">Smart gear for modern life</p>
            <Link
              href="/products?cat=tech"
              className="mt-4 inline-flex rounded-full px-6 py-2 text-sm font-semibold btn-primary"
            >
              Shop Tech
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white">
            <h3 className="text-2xl font-bold">Fashion & Lifestyle</h3>
            <p className="mt-2 text-gray-300">Style that moves with you</p>
            <Link
              href="/products?cat=fashion"
              className="mt-4 inline-flex rounded-full px-6 py-2 text-sm font-semibold btn-primary"
            >
              Shop Fashion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
