import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const imageSrc =
    product.thumbnail && product.thumbnail.trim().length > 0
      ? product.thumbnail
      : "/placeholder.png";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
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
          <h3 className="truncate text-base font-semibold text-gray-900">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-600">
            ${product.price}
          </span>

          <Link
            href={`/products/${product.id}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
