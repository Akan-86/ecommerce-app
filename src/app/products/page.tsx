"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// ---------------- Types ----------------
type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  thumbnail?: string;
  category?: string;
};

// ---------------- UI: Header (lightweight) ----------------
function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-black tracking-tight">
            VentoShop
          </Link>
          <nav className="hidden md:flex gap-4 text-sm text-gray-600">
            <Link href="/products" className="hover:text-black">
              Products
            </Link>
            <Link href="/categories" className="hover:text-black">
              Categories
            </Link>
            <Link href="/about" className="hover:text-black">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search…"
            className="hidden md:block px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <Link href="/cart" className="relative text-lg">
            🛒
          </Link>
          <Link href="/login" className="text-sm font-medium">
            Account
          </Link>
        </div>
      </div>
    </header>
  );
}

// ---------------- UI: Product Card ----------------
function ProductCard({ product }: { product: Product }) {
  const img = product.imageUrl || product.thumbnail;
  return (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-2xl transition overflow-hidden flex flex-col">
      <div className="relative h-64 bg-gray-100">
        {img ? (
          <Image
            src={img}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-lg font-semibold">
            No image
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
        <p className="text-brand-accent font-bold mb-4 text-xl">
          €{product.price.toFixed(2)}
        </p>
        <div className="mt-auto flex gap-3">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 text-center text-sm border border-black/20 rounded-lg py-2 hover:bg-black/5 font-medium transition"
          >
            View
          </Link>
          <button className="flex-1 text-sm bg-brand text-white rounded-lg py-2 hover:opacity-90 font-medium transition">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Page ----------------
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => p.category).filter(Boolean) as string[]
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort, minPrice, maxPrice, category]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--brand-bg-soft)" }}
    >
      <Header />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-black via-gray-900 to-black" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-black tracking-tight mb-3">
            Discover Our Collection
          </h1>
          <p className="text-white/70 max-w-xl">
            Curated premium essentials designed for modern lifestyles.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters */}
        <aside className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg h-fit sticky top-24 border border-black/5">
          <h2 className="font-bold mb-4">Filters</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Min Price</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value || 0))}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Max Price</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value || 10000))}
              />
            </div>
          </div>
        </aside>

        {/* Products */}
        <section>
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
            <p className="text-sm text-gray-600">{filtered.length} products</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                className="rounded-lg border border-black/10 px-3 py-2 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <option value="new">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-lg font-semibold mb-2">No products found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
