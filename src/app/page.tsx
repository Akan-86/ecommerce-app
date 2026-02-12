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
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop"
          alt="Shop hero"
          fill
          className="-z-10 object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-6 py-28 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                ✨ New Season <span className="text-white/60">·</span> Free
                shipping over €100
              </span>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Shop smarter.
                <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
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
                  className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-extrabold text-gray-900 shadow-lg hover:bg-yellow-300 hover:shadow-xl hover:scale-[1.02] transition"
                >
                  Browse Products
                </Link>
                <Link
                  href="/products?sort=new"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-7 py-3.5 text-sm font-extrabold text-white hover:bg-white/10 hover:scale-[1.02] transition"
                >
                  New Arrivals
                </Link>
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
              <div className="absolute inset-0 -z-10 rounded-3xl bg-white/10" />
              <div className="grid grid-cols-3 gap-4 p-6">
                {(products || []).slice(0, 6).map((p: any) => (
                  <div
                    key={p.id}
                    className="relative overflow-hidden rounded-2xl bg-gray-700 shadow"
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
      </section>

      {/* PROMO CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-md transition hover:shadow-xl">
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-200/40 blur-2xl" />
            <p className="text-xs font-semibold text-yellow-600">DEALS</p>
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
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl" />
            <p className="text-xs font-semibold text-yellow-600">RECOMMENDED</p>
            <h3 className="mt-2 text-lg font-bold">Continue shopping</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on your recent views
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-900"
            >
              View items →
            </Link>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-md transition hover:shadow-xl">
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-200/40 blur-2xl" />
            <p className="text-xs font-semibold text-yellow-600">DAILY</p>
            <h3 className="mt-2 text-lg font-bold">Daily essentials</h3>
            <p className="mt-1 text-sm text-gray-600">Save on everyday needs</p>
            <Link
              href="/products?promo=daily"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-900"
            >
              Start now →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {(products || []).slice(0, 10).map((p: any) => (
            <ProductCard key={p.id} product={p} />
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
              className="mt-4 inline-flex rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-gray-900"
            >
              Shop Tech
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white">
            <h3 className="text-2xl font-bold">Fashion & Lifestyle</h3>
            <p className="mt-2 text-gray-300">Style that moves with you</p>
            <Link
              href="/products?cat=fashion"
              className="mt-4 inline-flex rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-gray-900"
            >
              Shop Fashion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
