import { fetchProduct } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";

type Props = { params: { id: string } };

export default async function ProductDetail({ params }: Props) {
  const product = await fetchProduct(params.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full rounded-lg object-cover"
        />
      </div>
      <div>
        <h1 className="text-3xl font-semibold">{product.title}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="text-xl font-bold my-4">{product.price} $</div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
