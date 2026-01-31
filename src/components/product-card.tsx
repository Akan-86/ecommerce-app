"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { add } = useCart();

  const isOnSale =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 14
    : false;

  const rawImage =
    product.thumbnail || product.image || (product as any).imageUrl || "";

  const imageSrc =
    !imgError && typeof rawImage === "string" && rawImage.trim().length > 0
      ? rawImage
      : "/placeholder.png";

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setAdding(true);
    add({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: imageSrc,
    });
    // small UX delay for the spinner
    await new Promise((r) => setTimeout(r, 300));
    setAdding(false);
  };

  return (
    <article className="group flex w-full max-w-[260px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-full overflow-hidden bg-gray-100"
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

        <div className="relative w-full aspect-[4/5] bg-gray-100">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
          />
        </div>

        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="relative z-10 mt-2 flex gap-1.5">
          <button
            onClick={(e) => handleAddToCart(e)}
            disabled={adding}
            aria-busy={adding}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
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
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            View
          </Link>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-medium ${
              product.stock && product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stock && product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
