import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { ProductList } from "@/components/product-list";

async function fetchProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Page() {
  const products = await fetchProducts();

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-yellow-100 via-white to-white pt-36 pb-40">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-64 -left-64 h-[40rem] w-[40rem] rounded-full bg-yellow-300/40 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 -right-64 h-[40rem] w-[40rem] rounded-full bg-orange-200/40 blur-[140px]" />

        <div className="page-container relative z-10">
          <div className="grid max-w-6xl grid-cols-1 items-center gap-24 md:grid-cols-2">
            {/* Left */}
            <div>
              <span className="mb-6 inline-block rounded-full bg-yellow-200/70 px-4 py-1 text-sm font-semibold text-yellow-900">
                Trusted by 10,000+ customers across EU
              </span>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Premium shopping,
                <span className="relative ml-2 inline-block text-yellow-600">
                  simplified
                  <span className="absolute inset-x-0 -bottom-1 h-3 bg-yellow-200/60" />
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                Discover carefully selected European products with transparent €
                pricing, fast delivery, and a seamless checkout experience.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-xl bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-gray-800"
                >
                  Shop best sellers
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  View all products
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-14 grid grid-cols-3 gap-6 max-w-md text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8★</div>
                  <div className="text-sm text-gray-500">Avg rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">48h</div>
                  <div className="text-sm text-gray-500">EU delivery</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    14 days
                  </div>
                  <div className="text-sm text-gray-500">Free returns</div>
                </div>
              </div>
            </div>

            {/* Right - Product showcase */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 rounded-3xl bg-white/80 shadow-2xl backdrop-blur" />
              <div className="relative grid grid-cols-2 gap-6 p-8">
                <div className="relative col-span-2 flex h-60 items-center justify-center rounded-2xl bg-gray-100 shadow-sm">
                  <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900">
                    Best seller
                  </span>
                  <span className="text-gray-400">Featured product image</span>
                </div>

                <div className="flex h-44 items-center justify-center rounded-2xl bg-gray-200 shadow-sm">
                  <span className="text-gray-400">Product image</span>
                </div>

                <div className="flex h-44 items-center justify-center rounded-2xl bg-gray-200 shadow-sm">
                  <span className="text-gray-400">Product image</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade for continuity */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Why choose us */}
      <section className="bg-white">
        <div className="page-container section-spacing">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why choose our store
            </h2>
            <p className="mt-3 text-gray-600">
              Premium experience from browsing to delivery
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl">
                🚚
              </div>
              <h3 className="font-semibold text-gray-900">Fast EU delivery</h3>
              <p className="mt-2 text-sm text-gray-600">
                Reliable shipping across Europe with tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl">
                🔒
              </div>
              <h3 className="font-semibold text-gray-900">Secure payments</h3>
              <p className="mt-2 text-sm text-gray-600">
                Encrypted checkout and trusted payment providers.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl">
                ⭐
              </div>
              <h3 className="font-semibold text-gray-900">Verified quality</h3>
              <p className="mt-2 text-sm text-gray-600">
                Carefully selected products with proven quality.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl">
                🔄
              </div>
              <h3 className="font-semibold text-gray-900">Easy returns</h3>
              <p className="mt-2 text-sm text-gray-600">
                14-day return policy with no hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container section-spacing">
        <section className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Best sellers</h2>
            <p className="mt-1 text-sm text-gray-500">
              {products.length > 0
                ? `${products.length} products available`
                : "No products available"}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <Sidebar />

          {/* Products */}
          <div>
            <ProductList products={products} />
          </div>
        </div>
      </div>
    </main>
  );
}
