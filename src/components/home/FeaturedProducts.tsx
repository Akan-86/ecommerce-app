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
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Senin için seçtiğimiz premium ürünler
          </p>
        </div>

        <a
          href="/products"
          className="text-sm font-medium text-gray-900 hover:underline hidden md:block"
        >
          Tümünü gör →
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {featured.map((product) => (
          <div key={product.id} className="group transition duration-300">
            <ProductCard product={product} />

            <div className="mt-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
              Hızlı teslimat · Güvenli ödeme
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
