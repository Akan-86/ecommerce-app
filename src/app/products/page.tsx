"use client";

import { useState, useEffect } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
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

        // extract unique categories
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
    return <div className="p-6 text-center">Loading products...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-500">${product.price}</p>
              <p className="text-sm text-gray-400">{product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
