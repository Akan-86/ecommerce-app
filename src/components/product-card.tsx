"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const { lang } = useLanguage();

  const imageSrc = product.image || product.thumbnail || "/placeholder.png";

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
    <div className="group relative rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-black overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu will-change-transform hover:shadow-[0_50px_120px_rgba(0,0,0,0.18)] hover:-translate-y-2">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500 z-10" />
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-tr from-white/10 via-transparent to-white/20" />
        <img
          src={imageSrc}
          alt={product.title || "Product image"}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white leading-snug line-clamp-2">
          {product.title}
        </h3>

        <p className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency || "USD",
          }).format(product.price)}
        </p>

        {/* BUTTONS */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => router.push(`/products/${product.id}`)}
            className="w-full rounded-full border border-black/10 dark:border-white/20 py-2 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          >
            {lang === "tr" ? "Ürünü incele" : "View product"}
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black py-2.5 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
          >
            {lang === "tr" ? "Sepete ekle" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
