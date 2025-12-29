import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
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

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        {isOnSale && (
          <span className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
        {!isOnSale && isNew && (
          <span className="absolute left-3 top-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
            New
          </span>
        )}
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:underline">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-gray-900">
              ${product.price}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.id}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
