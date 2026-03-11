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
      <h1 className="text-3xl font-bold mb-2">
        {query ? `Search results for "${query}"` : "Search products"}
      </h1>

      {query && (
        <p className="text-sm text-gray-500 mb-8">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          found
        </p>
      )}

      {!query ? (
        <p className="text-gray-500">
          Start typing in the search bar to find products.
        </p>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-gray-700">No products found</p>
          <p className="text-sm text-gray-500 mt-2">
            Try searching with a different keyword.
          </p>
        </div>
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
