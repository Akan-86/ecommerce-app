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
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* IMAGE */}
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden">
        <img
          src={imageSrc}
          alt={product.title || "Product image"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
          {product.title}
        </h3>

        <p className="text-sm text-neutral-500">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency || "USD",
          }).format(product.price)}
        </p>
      </div>

      {/* QUICK ADD (on hover desktop) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart();
        }}
        className="mt-3 w-full rounded-md bg-black text-white dark:bg-white dark:text-black py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition"
      >
        {lang === "tr" ? "Sepete ekle" : "Add"}
      </button>
    </div>
  );
}
