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
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/70">
      <div className="container-modern flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em] text-black dark:text-white"
          >
            Velora
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-neutral-500 md:flex dark:text-neutral-300">
            <Link
              href="/products"
              className="transition hover:text-black dark:hover:text-white"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="transition hover:text-black dark:hover:text-white"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="transition hover:text-black dark:hover:text-white"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              const value = e.target.value.replace(/^\s+/, "");
              setSearch(value);

              const params = new URLSearchParams(window.location.search);
              if (value) {
                params.set("search", value);
              } else {
                params.delete("search");
              }

              const query = params.toString();
              window.history.replaceState(
                null,
                "",
                query ? `/products?${query}` : "/products"
              );
            }}
            className="hidden rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-2.5 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/5 md:block"
          />
          <Link
            href="/cart"
            className="rounded-full border border-black/10 px-3 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            Cart
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-700 transition hover:text-black dark:text-neutral-200 dark:hover:text-white"
          >
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
    <div className="group flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-neutral-900">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[0.95] overflow-hidden bg-neutral-100 dark:bg-neutral-950"
      >
        {img ? (
          <>
            <Image
              src={img}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-lg font-semibold">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-7">
        <Link
          href={`/products/${product.id}`}
          className="mb-3 text-xl font-semibold tracking-tight text-black transition hover:opacity-70 dark:text-white"
        >
          {product.title}
        </Link>
        <p className="mb-6 text-2xl font-semibold tracking-tight text-black dark:text-white">
          €{product.price.toFixed(2)}
        </p>
        <div className="mt-auto flex gap-3 pt-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-2xl border border-black/10 py-3 text-center text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            View
          </Link>
          <button className="flex-1 rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black">
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

    if (q !== null) setSearch(q);
    if (cat !== null) setCategory(cat);
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
      <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white animate-pulse dark:border-white/10 dark:bg-neutral-900">
        <div className="aspect-[0.95] bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-4 p-7">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Header search={search} setSearch={setSearch} />

      <section className="relative overflow-hidden border-b border-black/5 bg-gradient-to-b from-neutral-100 to-[#fafafa] dark:border-white/10 dark:from-neutral-950 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="container-modern relative py-20 sm:py-24">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-black dark:text-white md:text-7xl">
            Discover Our Collection
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500 dark:text-neutral-300">
            Explore curated premium essentials designed with a modern,
            minimalist approach.
          </p>
        </div>
      </section>

      <div className="container-modern grid grid-cols-1 gap-8 py-10 lg:grid-cols-[280px_1fr] lg:gap-10 lg:py-14">
        {/* Filters */}
        <aside className="h-fit rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.12)] transition-all duration-300 dark:border-white/10 dark:bg-neutral-900 lg:sticky lg:top-24">
          <h2 className="mb-6 text-lg font-semibold tracking-tight text-black dark:text-white">
            Refine Results
          </h2>

          <button
            onClick={() => {
              setCategory("all");
              setMinPrice(0);
              setMaxPrice(10000);
              setSort("new");
            }}
            className="mb-5 w-full rounded-2xl border border-black/10 py-3 text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            Clear Filters
          </button>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Category</label>
              <select
                className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/5"
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
                className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/5"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value || 0))}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Max Price</label>
              <input
                type="number"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value || 10000))}
              />
            </div>
          </div>
        </aside>

        {/* Products */}
        <section>
          {/* Sort bar */}
          <div className="mb-10 flex flex-col gap-4 rounded-[28px] border border-black/5 bg-white px-5 py-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-300">
              {loading ? (
                <span className="inline-block h-4 w-10 rounded bg-gray-200 animate-pulse" />
              ) : (
                <span className="font-semibold text-black dark:text-white">
                  {filtered.length}
                </span>
              )}
              {filtered.length === 1 ? "product found" : "products found"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:bg-white/5"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <option value="new">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 animate-[fadeUp_0.6s_ease] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-16 sm:py-20">
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
