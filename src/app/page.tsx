import { fetchProducts } from "@/lib/api";
import { ProductList } from "@/components/product-list";

export default async function Page() {
  const products = await fetchProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <span className="text-gray-500 text-sm">
          {products.length} products available
        </span>
      </div>

      <ProductList products={products} />
    </main>
  );
}
