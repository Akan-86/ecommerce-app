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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Featured Products
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Handpicked products you’ll love
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
