"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);

  const isOnSale =
    product.originalPrice && product.originalPrice > product.price;

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 14
    : false;

  const imageSrc =
    product.thumbnail && product.thumbnail.trim().length > 0
      ? product.thumbnail
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {isOnSale && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
            Sale
          </span>
        )}
        {!isOnSale && isNew && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
            New
          </span>
        )}

        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="relative flex flex-1 items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Adding…
              </span>
            ) : (
              "Add to cart"
            )}
          </button>

          <Link
            href={`/products/${product.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
