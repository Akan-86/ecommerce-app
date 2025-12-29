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
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-50 via-white to-gray-50 py-24">
        <div className="page-container">
          <div className="relative z-10 grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
            {/* Left */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                Discover products you’ll love
              </h1>

              <p className="mt-4 max-w-xl text-lg text-gray-600">
                Premium quality products, secure checkout, and fast delivery —
                all in one place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-xl bg-yellow-400 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  Shop now
                </Link>

                <span className="text-sm text-gray-500">
                  Free returns • Secure payments • Fast shipping
                </span>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span>Top-rated products</span>
                </div>
              </div>
            </div>

            {/* Right visual placeholder */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 rounded-3xl bg-white/60 shadow-lg backdrop-blur" />
              <div className="relative flex h-full items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 w-32 rounded-2xl bg-gray-100 shadow-sm" />
                  <div className="h-40 w-40 rounded-2xl bg-gray-200 shadow-sm" />
                  <div className="h-40 w-40 rounded-2xl bg-gray-200 shadow-sm" />
                  <div className="h-32 w-32 rounded-2xl bg-gray-100 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,224,71,0.25),transparent_60%)]" />
        </div>
      </section>

      <div className="page-container section-spacing">
        {/* Products header */}
        <section className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Best sellers</h2>
            <p className="mt-1 text-sm text-gray-500">
              {products.length > 0
                ? `${products.length} products available`
                : "No products available"}
            </p>
          </div>
        </section>

        {/* Product list */}
        <ProductList products={products} />
      </div>
    </main>
  );
}
