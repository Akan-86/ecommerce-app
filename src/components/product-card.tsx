"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import type { Product } from "@/lib/types";
import { ShoppingBag, Star } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const { lang } = useLanguage();

  const imageSrc = product.image || product.thumbnail || "/placeholder.png";

  const formattedPrice = new Intl.NumberFormat(
    lang === "tr" ? "tr-TR" : "en-US",
    {
      style: "currency",
      currency: product.currency || "USD",
    }
  ).format(product.price);

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.title,
      price: product.price,
      image: imageSrc,
      quantity: 1,
    });
  };

  return (
    <article
      className="group relative cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-100 dark:bg-neutral-900">
        <img
          src={imageSrc}
          alt={product.title || "Product image"}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Quick add */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="absolute bottom-4 left-4 right-4 flex translate-y-4 items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-3 text-sm font-medium text-black opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-black/90 dark:text-white"
        >
          <ShoppingBag size={16} />
          {lang === "tr" ? "Sepete ekle" : "Add to cart"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-3 px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
              {product.brand || "VELORA"}
            </p>

            <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
              {product.title}
            </h3>
          </div>

          <p className="shrink-0 text-sm font-semibold text-neutral-900 dark:text-white">
            {formattedPrice}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(product.rating || 4.6)
                    ? "fill-black text-black dark:fill-white dark:text-white"
                    : "text-neutral-300 dark:text-neutral-700"
                }
              />
            ))}
          </div>

          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {(product.rating || 4.6).toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}
