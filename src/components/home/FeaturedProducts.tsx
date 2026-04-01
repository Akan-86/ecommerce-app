import ProductCard from "@/components/product-card";

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  imageUrl?: string;
};

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  const featured = products?.slice(0, 8) || [];

  if (!featured.length) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-sm text-gray-500 dark:text-white/60">
          No products found.
        </p>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-gray-50/60 to-transparent dark:via-white/5" />
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <p className="text-sm text-gray-500 dark:text-white/60 mt-3 max-w-md">
            Curated premium picks just for you
          </p>
        </div>

        <a
          href="/products"
          className="text-sm font-medium text-gray-900 dark:text-white hidden md:inline-flex items-center gap-1 group"
        >
          View all
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, image: product.image || product.imageUrl }}
          />
        ))}
      </div>
    </section>
  );
}
