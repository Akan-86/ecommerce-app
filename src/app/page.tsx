export default async function Page() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  const products = await res.json();

  /* Right - Product showcase (real products) */
  return (
    <div className="relative hidden md:block">
      <div className="absolute inset-0 rounded-3xl bg-white/80 shadow-2xl backdrop-blur" />
      <div className="relative grid grid-cols-2 gap-6 p-8">
        {(products || []).slice(0, 3).map((product: any, i: number) => (
          <div
            key={product.id}
            className={`relative flex items-center justify-center rounded-2xl bg-gray-100 shadow-sm overflow-hidden ${
              i === 0 ? "col-span-2 h-60" : "h-44"
            }`}
          >
            {i === 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900">
                Featured
              </span>
            )}

            {product.image || product.thumbnail ? (
              <img
                src={product.image || product.thumbnail}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
