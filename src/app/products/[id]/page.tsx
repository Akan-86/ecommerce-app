import { fetchProduct } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";

type Props = { params: { id: string } };

export default async function ProductDetail({ params }: Props) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return (
      <div className="py-12 text-center text-gray-600">Product not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full max-h-[420px] rounded-xl object-cover border border-gray-200 bg-white shadow-sm"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-4">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold text-emerald-600">
              ${product.price}
            </span>
            {product.category && (
              <span className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-700">
                {product.category}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">In stock</span> – ships
            within 24 hours
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
