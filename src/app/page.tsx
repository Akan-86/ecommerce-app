import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product-card";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`,
    {
      cache: "no-store",
    }
  );
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

      {/* TRUST BAR */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🚚</span>
            <p className="font-semibold">Free Shipping</p>
            <p className="text-gray-500 text-xs">Orders over €100</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🔒</span>
            <p className="font-semibold">Secure Payment</p>
            <p className="text-gray-500 text-xs">Stripe protected</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">↩️</span>
            <p className="font-semibold">Easy Returns</p>
            <p className="text-gray-500 text-xs">30 day policy</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">⭐</span>
            <p className="font-semibold">Top Rated</p>
            <p className="text-gray-500 text-xs">Trusted products</p>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY ICONS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 text-center">
            <Link
              href="/products?cat=tech"
              className="group flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
                💻
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600">
                Tech
              </span>
            </Link>

            <Link
              href="/products?cat=fashion"
              className="group flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
                👕
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600">
                Fashion
              </span>
            </Link>

            <Link
              href="/products?cat=lifestyle"
              className="group flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
                🏠
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600">
                Home
              </span>
            </Link>

            <Link
              href="/products?cat=sports"
              className="group flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
                ⚽
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600">
                Sports
              </span>
            </Link>

            <Link
              href="/products?cat=beauty"
              className="group flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
                💄
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600">
                Beauty
              </span>
            </Link>

            <Link
              href="/products"
              className="group flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-emerald-100 transition">
                🛍️
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600">
                All
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROMO CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
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

      {/* CATEGORY GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              Categories
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products?cat=fashion"
            className="group relative overflow-hidden rounded-3xl bg-gray-900 text-white h-[320px] flex items-end p-8 shadow-xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop"
              alt="Fashion"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">Fashion</h3>
              <p className="text-sm text-white/80">Modern everyday style</p>
            </div>
          </Link>

          <Link
            href="/products?cat=tech"
            className="group relative overflow-hidden rounded-3xl bg-gray-900 text-white h-[320px] flex items-end p-8 shadow-xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop"
              alt="Tech"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">Tech</h3>
              <p className="text-sm text-white/80">Smart devices & gadgets</p>
            </div>
          </Link>

          <Link
            href="/products?cat=lifestyle"
            className="group relative overflow-hidden rounded-3xl bg-gray-900 text-white h-[320px] flex items-end p-8 shadow-xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1600&auto=format&fit=crop"
              alt="Lifestyle"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">Lifestyle</h3>
              <p className="text-sm text-white/80">
                Upgrade your daily routine
              </p>
            </div>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* FEATURED */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
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

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {(products || []).slice(0, 10).map((p: any, index: number) => (
            <div
              key={p.id}
              className="min-w-[220px] sm:min-w-[240px] md:min-w-[260px] snap-start animate-[fadeUp_0.6s_ease_forwards] opacity-0"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
              Popular Products
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(products || []).slice(10, 20).map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CATEGORY BANNERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-all duration-300">
            <h3 className="text-2xl font-bold">Tech & Gadgets</h3>
            <p className="mt-2 text-gray-300">Smart gear for modern life</p>
            <Link
              href="/products?cat=tech"
              className="mt-4 inline-flex rounded-full px-6 py-2 text-sm font-semibold btn-primary"
            >
              Shop Tech
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-all duration-300">
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
      {/* NEWSLETTER / COMMUNITY */}
      <section className="bg-emerald-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold">
              Join our community
            </p>
            <h3 className="mt-3 text-3xl font-extrabold">
              Get exclusive deals & product drops
            </h3>
            <p className="mt-3 text-emerald-100 text-sm max-w-md">
              Subscribe to our newsletter and be the first to know about new
              collections, limited offers and curated product picks.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full px-5 py-3 text-sm text-gray-900 outline-none"
              />
              <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition">
                Subscribe
              </button>
            </div>

            <p className="mt-4 text-xs text-emerald-100/80">
              12,000+ subscribers already joined.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">12K+</p>
              <p className="text-xs text-emerald-100">Subscribers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.8★</p>
              <p className="text-xs text-emerald-100">Customer rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-xs text-emerald-100">Products</p>
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
          <div>
            <h4 className="text-white font-bold text-lg">Shop</h4>
            <p className="mt-3 text-sm text-gray-400">
              Premium products across fashion, tech and lifestyle categories.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Company</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">About</Link>
              </li>
              <li>
                <Link href="#">Careers</Link>
              </li>
              <li>
                <Link href="#">Press</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Support</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">Help Center</Link>
              </li>
              <li>
                <Link href="#">Returns</Link>
              </li>
              <li>
                <Link href="#">Shipping</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ecommerce Store. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
