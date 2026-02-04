"use client";

import { useState, useEffect } from "react";
import ProductList from "@/components/product-list";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  thumbnail?: string;
  image?: string;
  imageUrl?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);

        const uniqueCategories = Array.from(
          new Set(data.map((p: Product) => p.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading products…</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
      {/* Sidebar */}
      <aside className="border rounded-lg p-4 bg-white h-fit">
        <h2 className="font-semibold text-lg mb-4">Filter by Category</h2>

        <ul className="space-y-2">
          <li key="all">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedCategory === "all"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
          </li>

          {categories.map((cat, i) => (
            <li key={`${cat}-${i}`}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Product Grid */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <ProductList products={filteredProducts} />
        )}
      </section>
    </div>
  );
}
