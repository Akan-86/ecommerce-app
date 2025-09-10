import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="flex justify-between mt-3">
        <span className="font-medium">{product.title}</span>
        <span className="font-semibold">{product.price} $</span>
      </div>
      <Link
        href={`/products/${product.id}`}
        className="inline-block mt-3 text-blue-600 hover:underline"
      >
        Go to Details
      </Link>
    </div>
  );
}
