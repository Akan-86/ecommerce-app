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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <span className="text-sm text-gray-500">Our top picks for you</span>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {featured.map((product) => (
          <div key={product.id} className="min-w-[240px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
