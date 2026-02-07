"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  thumbnail?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              AkanShop
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
          <div className="flex items-center gap-4">
            <input
              placeholder="Search products…"
              className="hidden md:block px-3 py-1.5 rounded-md border text-sm"
            />
            <Link href="/cart" className="relative text-lg">
              🛒
            </Link>
            <Link href="/login" className="text-sm">
              Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-white/80">
            Browse our full collection of premium items.
          </p>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative h-56 bg-gray-100">
                {(() => {
                  const img = p.imageUrl || p.thumbnail;
                  return img ? (
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  );
                })()}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                <p className="text-indigo-600 font-bold mb-3">
                  €{p.price.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="flex-1 text-center text-sm border rounded-md py-1.5 hover:bg-gray-100"
                  >
                    View
                  </Link>
                  <button className="flex-1 text-sm bg-indigo-600 text-white rounded-md py-1.5 hover:bg-indigo-700">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
