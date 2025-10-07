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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full rounded-lg object-cover shadow"
        />
      </div>
      <div>
        <h1 className="text-3xl font-semibold">{product.title}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>

        <div className="flex items-center gap-4 my-4">
          <span className="text-xl font-bold">{product.price} $</span>
          {product.category && (
            <span className="px-2 py-1 text-sm bg-gray-100 rounded">
              {product.category}
            </span>
          )}
        </div>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
