"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";

export default function ProductCard({ product }: any) {
  const router = useRouter();
  const { add } = useCart();
  const { lang } = useLanguage();

  const imageSrc = product?.imageUrl || product?.image || "/placeholder.png";

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.title,
      price: product.price,
      imageUrl: imageSrc,
    });
  };

  return (
    <div className="group relative rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:-translate-y-1">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageSrc}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-brand-900 dark:text-white line-clamp-2">
          {product.title}
        </h3>

        <p className="text-lg font-bold text-[var(--brand-primary)]">
          €{product.price}
        </p>

        {/* BUTTONS */}
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-black text-white dark:bg-white dark:text-black py-2 text-sm font-semibold transition hover:opacity-90 active:scale-95"
          >
            {lang === "tr" ? "Sepete ekle" : "Add to cart"}
          </button>

          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="flex-1 rounded-xl border border-black/10 dark:border-white/20 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            {lang === "tr" ? "İncele" : "View"}
          </button>
        </div>
      </div>
    </div>
  );
}
