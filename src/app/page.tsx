import { ProductList } from "@/components/product-list";

async function fetchProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
      cache: "no-store", // Ensure fresh data on each request
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Page() {
  const products = await fetchProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <span className="text-gray-500 text-sm">
          {products.length > 0
            ? `${products.length} products available`
            : "No products available"}
        </span>
      </div>

      <ProductList products={products} />
    </main>
  );
}
