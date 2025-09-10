import { fetchProducts } from "@/lib/api";
import { ProductList } from "@/components/product-list";

export default async function Page() {
  const products = await fetchProducts();
  return (
    <>
      <h1 className="text-2xl font-bold">All Products</h1>
      <ProductList products={products} />
    </>
  );
}
