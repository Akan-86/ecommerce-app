"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmptyState from "@/components/ui/empty-state";
import { SearchX } from "lucide-react";
import { fetchProducts } from "@/lib/api";

// ---------------- Types ----------------
type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  thumbnail?: string;
  image?: string;
  images?: string[];
  category?: string;
};

// ---------------- UI: Header (lightweight) ----------------
function Header({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (v: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
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
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/^\s+/, ""))}
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
  const img =
    product.imageUrl ||
    product.thumbnail ||
    product.image ||
    (Array.isArray(product.images) ? product.images[0] : undefined);
  return (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-2xl transition overflow-hidden flex flex-col">
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {img ? (
          <>
            <Image
              src={img}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </>
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [category, setCategory] = useState<string>("all");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync filters with URL (?search= / ?category=)
  useEffect(() => {
    const q = searchParams.get("search");
    const cat = searchParams.get("category");

    if (q) setSearch(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        console.log("API PRODUCTS RESPONSE:", data);
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      products.map((p) => p.category).filter(Boolean) as string[]
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      const text = `${p.title}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());

      return matchesPrice && matchesSearch;
    });
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort, minPrice, maxPrice, category, search]);

  function ProductSkeleton() {
    return (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--brand-bg-soft)" }}
    >
      <Header search={search} setSearch={setSearch} />

      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-black via-gray-900 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight">
            Discover Our Collection
          </h1>
          <p className="text-white/70 max-w-xl">
            Curated premium essentials designed for modern lifestyles.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 sm:gap-8">
        {/* Filters */}
        <aside className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] h-fit lg:sticky lg:top-24 border border-black/5 transition-all duration-300">
          <h2 className="text-lg font-extrabold tracking-tight mb-6">
            Refine Results
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Category</label>
              <select
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                value={category}
                onChange={(e) => {
                  const value = e.target.value;
                  setCategory(value);

                  const params = new URLSearchParams(searchParams.toString());
                  if (value === "all") {
                    params.delete("category");
                  } else {
                    params.set("category", value);
                  }

                  router.push(`/products?${params.toString()}`);
                }}
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
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value || 0))}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Max Price</label>
              <input
                type="number"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value || 10000))}
              />
            </div>
          </div>
        </aside>

        {/* Products */}
        <section>
          {/* Sort bar */}
          <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 bg-white/80 backdrop-blur rounded-2xl px-4 sm:px-6 py-4 border border-black/5 shadow-sm">
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              {loading ? (
                <span className="inline-block h-4 w-10 rounded bg-gray-200 animate-pulse" />
              ) : (
                <span className="text-gray-900 font-semibold">
                  {filtered.length}
                </span>
              )}
              products found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <option value="new">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-10 sm:py-16">
                <EmptyState
                  icon={<SearchX size={28} />}
                  title="No products found"
                  description="We couldn’t find any products matching your current filters. Try adjusting your criteria or explore all products."
                  primaryAction={
                    <button
                      onClick={() => {
                        setCategory("all");
                        setMinPrice(0);
                        setMaxPrice(10000);
                        setSort("new");
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold btn-primary transition-all duration-250 active:scale-[0.97]"
                    >
                      Clear Filters
                    </button>
                  }
                  secondaryAction={
                    <Link
                      href="/products"
                      className="px-4 py-2 rounded-lg text-sm font-semibold border border-brand-200 text-brand-700 hover:bg-brand-100 transition-all duration-250 active:scale-[0.97]"
                    >
                      Browse All
                    </Link>
                  }
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
