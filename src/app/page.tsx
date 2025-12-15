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
    <main className="mx-auto max-w-7xl px-4 pb-16">
      {/* Hero */}
      <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-50 via-white to-gray-50 px-8 py-20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            Discover products you’ll love
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Premium quality products, secure checkout, and fast delivery.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center rounded-xl bg-yellow-400 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Shop now
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,224,71,0.25),transparent_60%)]" />
      </section>

      {/* Products header */}
      <section className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Featured products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {products.length > 0
              ? `${products.length} products available`
              : "No products available"}
          </p>
        </div>
      </section>

      {/* Product list */}
      <ProductList products={products} />
    </main>
  );
}
