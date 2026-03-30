import ProductCard from "@/components/product-card";

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
};

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  const featured = products?.slice(0, 8) || [];

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-gray-50/60 to-transparent" />
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-sm text-gray-500 mt-3 max-w-md">
            Senin için seçtiğimiz premium ürünler
          </p>
        </div>

        <a
          href="/products"
          className="text-sm font-medium text-gray-900 hidden md:inline-flex items-center gap-1 group"
        >
          Tümünü gör
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {featured.map((product) => (
          <div
            key={product.id}
            className="group transition duration-500 hover:-translate-y-1"
          >
            <ProductCard product={product} />

            <div className="mt-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition duration-300 tracking-wide">
              Hızlı teslimat · Güvenli ödeme
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
