import { searchProducts } from "@/lib/api";
import ProductCard from "@/components/product-card";

interface Props {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";

  const products = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `Search results for "${query}"` : "Search"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
