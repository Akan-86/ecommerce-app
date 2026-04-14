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
    <div className="group relative rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-black overflow-hidden transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] hover:-translate-y-1">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageSrc}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">
          {product.title}
        </h3>

        <p className="text-base font-semibold text-gray-900 dark:text-white">
          €{product.price}
        </p>

        {/* BUTTONS */}
        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            {lang === "tr" ? "Sepete ekle" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
