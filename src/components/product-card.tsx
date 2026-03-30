"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { Heart } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { add } = useCart();
  const { lang } = useLanguage();

  const isOnSale =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 14
    : false;

  const isLowStock =
    typeof product.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 5;

  // Fake rating data (until real review system is added)
  const rating = 4.2;
  const reviewCount = 42;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  const rawImage =
    typeof (product as any).imageUrl === "string" &&
    (product as any).imageUrl.trim().length > 0
      ? (product as any).imageUrl
      : typeof product.image === "string" && product.image.trim().length > 0
        ? product.image
        : typeof product.thumbnail === "string" &&
            product.thumbnail.trim().length > 0
          ? product.thumbnail
          : Array.isArray((product as any).images) &&
              (product as any).images.length > 0
            ? (product as any).images[0]
            : null;

  const secondaryImageRaw =
    Array.isArray((product as any).images) && (product as any).images.length > 1
      ? (product as any).images[1]
      : null;

  const secondaryImage =
    typeof secondaryImageRaw === "string" && secondaryImageRaw.trim().length > 0
      ? secondaryImageRaw
      : null;

  const secondarySrc =
    typeof secondaryImage === "string" && secondaryImage.trim().length > 0
      ? secondaryImage
      : null;

  const imageSrc =
    !imgError && typeof rawImage === "string" && rawImage.trim().length > 0
      ? rawImage
      : "/placeholder.png";

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "de-DE", {
      style: "currency",
      currency: lang === "tr" ? "TRY" : "EUR",
    }).format(value);

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setAdding(true);
    add({
      id: product.id,
      name: product.title,
      price: product.price,
      imageUrl: imageSrc,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
    // small UX delay for the spinner
    await new Promise((r) => setTimeout(r, 300));
    setAdding(false);
  };

  return (
    <article
      data-testid="product-card"
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-gray-300/80"
    >
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        data-testid="product-link"
        className="relative block w-full overflow-hidden bg-gray-100"
      >
        {/* Badges */}
        {isOnSale && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-red-600/95 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {(() => {
              const discount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0;
              return `-${discount}%`;
            })()}
          </span>
        )}
        {!isOnSale && isNew && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-blue-600/95 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {lang === "tr" ? "Yeni" : "New"}
          </span>
        )}
        {!isOnSale && !isNew && isLowStock && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {lang === "tr" ? "Az stok" : "Low stock"}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setLiked((prev) => !prev);
          }}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
        >
          <Heart
            size={16}
            className={liked ? "fill-red-500 text-red-500" : "text-gray-600"}
          />
        </button>

        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden rounded-t-2xl">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
          )}
          <Image
            src={
              imageSrc ||
              "https://images.unsplash.com/photo-1556306535-0f09a537f0a3"
            }
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
            className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onError={() => setImgError(true)}
            onLoad={() => setImgLoaded(true)}
            priority={false}
          />

          {secondarySrc ? (
            <Image
              src={secondarySrc}
              alt={`${product.title} secondary`}
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
              className="object-cover opacity-0 scale-105 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100"
            />
          ) : null}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 translate-y-4 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <button
            data-testid="quick-add"
            onClick={(e) => handleAddToCart(e)}
            className="btn btn-primary-modern mb-4 shadow-lg hover:scale-105 hover:shadow-2xl active:scale-[0.96] transition-all duration-300"
          >
            {lang === "tr" ? "Hızlı ekle" : "Quick add"}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-2.5">
        <div>
          {product.category && (
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {product.category}
            </p>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 tracking-tight transition-all duration-300 group-hover:text-brand-700 group-hover:tracking-normal">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-gray-500">
              {product.description}
            </p>
          )}
          {/* Rating */}
          <div className="mt-1 flex items-center gap-1 text-amber-500 text-[10px] select-none">
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < fullStars) return <span key={i}>★</span>;
              if (i === fullStars && hasHalfStar)
                return (
                  <span key={i} className="opacity-70">
                    ★
                  </span>
                );
              return (
                <span key={i} className="text-gray-300">
                  ★
                </span>
              );
            })}
            <span className="ml-1 text-gray-500">({reviewCount})</span>
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 mt-1.5 flex gap-1 transition-transform duration-200 group-hover:translate-y-[-1px]">
          <button
            data-testid="add-to-cart"
            onClick={(e) => handleAddToCart(e)}
            disabled={adding}
            aria-busy={adding}
            className="flex-1 inline-flex items-center justify-center btn btn-primary-modern shadow-md hover:shadow-2xl hover:scale-[1.04] active:scale-[0.96] transition-all duration-300"
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {lang === "tr" ? "Ekleniyor…" : "Adding…"}
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
                {lang === "tr" ? "Sepete ekle" : "Add to cart"}
              </span>
            )}
          </button>

          <Link
            href={`/products/${product.id}`}
            className="flex-1 inline-flex items-center justify-center btn btn-secondary-modern"
          >
            {lang === "tr" ? "İncele" : "View"}
          </Link>
        </div>

        {/* Price */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
              style={{ color: "var(--brand-primary)" }}
            >
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            {isOnSale && product.originalPrice && (
              <span
                className="text-xs font-medium"
                style={{ color: "var(--brand-primary)" }}
              >
                {lang === "tr" ? "Tasarruf" : "Save"}{" "}
                {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-medium ${
              product.stock && product.stock > 0 ? "" : "text-red-500"
            }`}
            style={
              product.stock && product.stock > 0
                ? { color: "var(--brand-primary)" }
                : undefined
            }
          >
            {product.stock && product.stock > 0
              ? lang === "tr"
                ? "Stokta"
                : "In stock"
              : lang === "tr"
                ? "Stokta yok"
                : "Out of stock"}
          </span>
        </div>
        {typeof product.stock === "number" && product.stock > 0 && (
          <div className="mt-1.5 h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(product.stock, 10) * 10}%`,
                backgroundColor: "var(--brand-primary)",
              }}
            />
          </div>
        )}
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-all duration-500 group-hover:opacity-100 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent"
        style={{ boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.08)" }}
      />
      {showToast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/90 backdrop-blur-xl px-4 py-2 text-[11px] font-medium text-white shadow-2xl animate-fade-in">
          {lang === "tr" ? "Sepete eklendi" : "Added to cart"} ✓
        </div>
      )}
    </article>
  );
}
