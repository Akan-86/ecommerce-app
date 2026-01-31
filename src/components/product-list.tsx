"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./product-card";

export default function ProductList({
  products = [],
}: {
  products?: Product[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const isLoading = !products || products.length === 0;

  const filteredProducts = useMemo(() => {
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Browse our latest additions and best sellers.
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {isLoading ? "Loading…" : `${filteredProducts.length} items`}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-14 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Search</label>
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Max price (€)
          </label>
          <input
            type="number"
            aria-label="Maximum price"
            placeholder="∞"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? Number(e.target.value) : null)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="flex items-end">
          <p className="text-xs text-gray-400">
            Tip: Use filters to narrow results
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white"
            >
              <div className="aspect-[3/4] rounded-t-2xl bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-10 rounded bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-32 text-center">
          <p className="text-lg font-semibold text-gray-900">
            No products found
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or check back later.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
              setMaxPrice(null);
            }}
            className="mt-4 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid animate-fadeIn grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="mx-auto w-full max-w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
