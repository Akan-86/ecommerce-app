import ProductCard from "@/components/product-card";

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
};

export default function BestSellers({ products }: { products: Product[] }) {
  const best = products?.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Best Sellers</h2>
          <p className="text-sm text-gray-500">
            Our most popular products right now
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {best?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
