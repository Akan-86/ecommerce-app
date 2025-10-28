import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.thumbnail?.trim()
    ? product.thumbnail
    : "/placeholder.png"; // ✅ Bonus: fallback görsel

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={product.title}
        className="w-full h-48 object-cover bg-gray-100"
        loading="lazy"
      />

      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 truncate">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-green-600">
            ${product.price}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
