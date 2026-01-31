export default async function Page() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  const products = await res.json();

  /* Right - Product showcase (real products) */
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                New Season · Free Shipping over €100
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Shop smarter. Discover better.
              </h1>
              <p className="mt-4 max-w-xl text-gray-200">
                Premium products across fashion, tech, and lifestyle. Curated
                for quality and value.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="/products"
                  className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                >
                  Browse Products
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  New Arrivals
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-3xl bg-white/10" />
              <div className="grid grid-cols-3 gap-3 p-6">
                {(products || []).slice(0, 3).map((product: any) => (
                  <div
                    key={product.id}
                    className="relative overflow-hidden rounded-2xl bg-gray-700"
                  >
                    {product.image || product.thumbnail ? (
                      <img
                        src={product.image || product.thumbnail}
                        alt={product.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-gray-400">
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

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <a
            href="/products"
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            View all
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {(products || []).slice(0, 10).map((product: any) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              {product.image || product.thumbnail ? (
                <img
                  src={product.image || product.thumbnail}
                  alt={product.title}
                  className="h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="mt-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                  {product.title}
                </h3>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  €{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
