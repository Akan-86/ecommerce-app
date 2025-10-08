"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Derived filtered products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" ? true : p.category === category;

      const matchesPrice = maxPrice ? p.price <= maxPrice : true;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, maxPrice]);

  // Collect unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-gray-50 p-4 rounded-md shadow-sm">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : null)
          }
          className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No products found 🛒</p>
          <p className="text-sm">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
