import { fetchProduct, fetchRelatedProducts } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";

type Props = { params: { id: string } };

export default async function ProductDetail({ params }: Props) {
  const product = await fetchProduct(params.id);

  const sanitizeProduct = (data: any) => {
    if (!data) return null;

    const createdAt =
      data.createdAt && typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate().toISOString()
        : data.createdAt || null;

    const updatedAt =
      data.updatedAt && typeof data.updatedAt.toDate === "function"
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt || null;

    const thumbnail =
      typeof data.thumbnail === "string" && data.thumbnail.trim().length > 0
        ? data.thumbnail
        : "/placeholder.png";

    const images = Array.isArray(data.images)
      ? data.images.filter(
          (img: any) => typeof img === "string" && img.trim().length > 0
        )
      : [];

    return {
      ...data,
      thumbnail,
      images,
      createdAt,
      updatedAt,
    };
  };

  const relatedRaw = product?.category
    ? await fetchRelatedProducts(product.category, product.id, 4)
    : [];

  const safeProduct = sanitizeProduct(product);
  const related = Array.isArray(relatedRaw)
    ? relatedRaw.map((item: any) => sanitizeProduct(item))
    : [];

  if (!safeProduct) {
    return (
      <div className="py-16 text-center text-gray-500">Product not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
      <div className="grid grid-cols-1 gap-12 md:gap-16 md:grid-cols-2 items-start">
        {/* Product Image */}
        <div className="space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 shadow-2xl group">
            <Image
              src={safeProduct.thumbnail}
              alt={safeProduct.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>

          {safeProduct.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {safeProduct.images
                .slice(0, 4)
                .map((img: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-gray-100"
                  >
                    <Image
                      src={img}
                      alt={`${safeProduct.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 md:space-y-8 md:sticky md:top-28">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {safeProduct.title}
            </h1>

            <p className="text-base leading-relaxed text-gray-600 max-w-lg">
              {safeProduct.description}
            </p>
          </div>

          {/* Pricing Card */}
          <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] space-y-6 sm:space-y-8">
            <div className="flex items-end gap-4">
              <span
                className="text-5xl font-extrabold tracking-tight"
                style={{ color: "var(--brand-primary)" }}
              >
                ${safeProduct.price}
              </span>

              {safeProduct.category && (
                <span className="rounded-full bg-gray-100 px-4 py-1 text-xs font-semibold text-gray-700">
                  {safeProduct.category}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <span
                className="font-semibold"
                style={{ color: "var(--brand-primary)" }}
              >
                In stock
              </span>{" "}
              — ships within 24 hours
            </div>

            {/* Trust Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500 pt-4 border-t border-black/5">
              <div>
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p>On orders over $100</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">30-Day Returns</p>
                <p>Hassle-free policy</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Secure Payment</p>
                <p>Encrypted checkout</p>
              </div>
            </div>

            <AddToCartButton product={safeProduct} />
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16" />
      </div>

      {/* Review Preview */}
      <div className="mt-20 sm:mt-24 max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Customer Reviews
        </h2>

        <div className="rounded-3xl border border-black/5 bg-white p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] space-y-8">
          <div className="flex items-center gap-4">
            <span
              className="text-4xl font-extrabold"
              style={{ color: "var(--brand-primary)" }}
            >
              4.8
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Overall Rating
              </p>
              <p className="text-xs text-gray-500">Based on 124 reviews</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <p>★★★★★ — 82%</p>
            <p>★★★★☆ — 12%</p>
            <p>★★★☆☆ — 4%</p>
            <p>★★☆☆☆ — 1%</p>
            <p>★☆☆☆☆ — 1%</p>
          </div>
        </div>
      </div>

      <div className="mt-28">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16" />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-28">
          <h2 className="text-2xl font-bold mb-10 text-gray-900">
            You may also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
