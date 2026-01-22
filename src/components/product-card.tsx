"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOnSale =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 14
    : false;

  const imageSrc =
    !imgError &&
    (product.thumbnail || product.image) &&
    (product.thumbnail || product.image)!.trim().length > 0
      ? (product.thumbnail || product.image)!
      : "/placeholder.png";

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const handleAddToCart = async () => {
    setAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-gray-900/10">
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100"
      >
        {/* Badges */}
        {isOnSale && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-red-600/95 px-3 py-1 text-xs font-semibold text-white shadow-md">
            Sale
          </span>
        )}
        {!isOnSale && isNew && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-blue-600/95 px-3 py-1 text-xs font-semibold text-white shadow-md">
            New
          </span>
        )}

        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImgError(true)}
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
        />

        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-gray-900 group-hover:underline">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-medium ${
              product.stock && product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stock && product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            aria-busy={adding}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Adding…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M7.5 6.75a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z" />
                  <path
                    fillRule="evenodd"
                    d="M6.75 3a.75.75 0 00-.75.75v.75H4.5a.75.75 0 000 1.5h.193l.8 9.21A3 3 0 007.685 18h8.63a3 3 0 002.992-2.79l.8-9.21H21a.75.75 0 000-1.5h-1.5v-.75A.75.75 0 0018.75 3H6.75zm1.5 3h7.5l-.72 8.28a1.5 1.5 0 01-1.496 1.395H8.466a1.5 1.5 0 01-1.496-1.395L6.25 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Add to cart
              </span>
            )}
          </button>

          <Link
            href={`/products/${product.id}`}
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
