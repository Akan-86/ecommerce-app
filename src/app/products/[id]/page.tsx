"use client";

import { fetchProduct, fetchRelatedProducts } from "@/lib/api";
import { AddToCartButton } from "@/components/add-to-cart-button";
import ProductCard from "@/components/product-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [relatedRaw, setRelatedRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        : typeof data.imageUrl === "string" && data.imageUrl.trim().length > 0
          ? data.imageUrl
          : "/placeholder.png";

    const images = Array.isArray(data.images)
      ? data.images.filter(
          (img: any) => typeof img === "string" && img.trim().length > 0
        )
      : typeof data.imageUrl === "string" && data.imageUrl.trim().length > 0
        ? [data.imageUrl]
        : [];

    return {
      ...data,
      thumbnail,
      images,
      createdAt,
      updatedAt,
    };
  };

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        setLoading(true);
        const data = await fetchProduct(id);
        setProduct(data);

        if (data?.category) {
          const rel = await fetchRelatedProducts(data.category, data.id, 4);
          setRelatedRaw(rel || []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load product", err);
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const safeProduct = sanitizeProduct(product);

  const gallery = [
    safeProduct?.thumbnail,
    ...(safeProduct?.images || []),
  ].filter(
    (img, index, arr) => typeof img === "string" && arr.indexOf(img) === index
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "shipping" | "reviews"
  >("description");

  useEffect(() => {
    if (!selectedImage && gallery.length > 0) {
      setSelectedImage(gallery[0]);
    }
  }, [gallery, selectedImage]);

  useEffect(() => {
    setSelectedImage(null);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyCart(true);
      } else {
        setShowStickyCart(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const related = Array.isArray(relatedRaw)
    ? relatedRaw.map((item: any) => sanitizeProduct(item))
    : [];

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">Loading product...</div>
    );
  }

  if (!safeProduct) {
    return (
      <div className="py-16 text-center text-gray-500">Product not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
      {/* Breadcrumb */}
      <div className="mb-10 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-gray-900">
          Products
        </Link>
        {safeProduct?.category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">
              {safeProduct.category}
            </span>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-12 md:gap-16 md:grid-cols-2 items-start">
        {/* Product Image */}
        <div className="space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)] group">
            {safeProduct?.sale && (
              <div className="absolute top-4 left-4 z-10 rounded-full bg-red-500 text-white text-xs font-bold px-3 py-1 shadow">
                SALE
              </div>
            )}
            <Image
              src={selectedImage || "/placeholder.png"}
              alt={safeProduct.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {gallery.map((img: string, index: number) => {
                const isActive = selectedImage === img;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square overflow-hidden rounded-xl cursor-pointer border transition-all duration-300
                      ${isActive ? "border-black ring-2 ring-black/20 scale-105" : "border-black/10 hover:border-black/30 hover:scale-105"}`}
                  >
                    <Image
                      src={img}
                      alt={`${safeProduct.title} ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 md:space-y-8 md:sticky md:top-28">
          <div className="space-y-4">
            {safeProduct.category && (
              <span className="inline-block rounded-full bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1">
                {safeProduct.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
              {safeProduct.title}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.6 11.545 1 7.91l6.061-.545L10 2l2.939 5.364L19 7.91l-4.6 3.636 1.478 6.545z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.6 11.545 1 7.91l6.061-.545L10 2l2.939 5.364L19 7.91l-4.6 3.636 1.478 6.545z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.6 11.545 1 7.91l6.061-.545L10 2l2.939 5.364L19 7.91l-4.6 3.636 1.478 6.545z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.6 11.545 1 7.91l6.061-.545L10 2l2.939 5.364L19 7.91l-4.6 3.636 1.478 6.545z" />
                </svg>
                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.6 11.545 1 7.91l6.061-.545L10 2l2.939 5.364L19 7.91l-4.6 3.636 1.478 6.545z" />
                </svg>
              </div>
              <span className="text-gray-600">4.8 · 124 reviews</span>
            </div>

            <p className="text-base leading-relaxed text-gray-500 max-w-md">
              {safeProduct.description}
            </p>
            <ul className="text-sm text-gray-500 space-y-1 pt-2">
              <li>✔ Premium quality materials</li>
              <li>✔ Fast worldwide shipping</li>
              <li>✔ 30‑day money‑back guarantee</li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-black/5 text-gray-700">
                Free returns
              </span>
              <span className="px-3 py-1 rounded-full bg-black/5 text-gray-700">
                Secure checkout
              </span>
              <span className="px-3 py-1 rounded-full bg-black/5 text-gray-700">
                Fast delivery
              </span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.25)] hover:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.3)] transition-all duration-300 space-y-6 sm:space-y-8">
            <div className="flex items-end gap-4">
              <span className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {Number(safeProduct.price).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
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
              — ships within 24 hours • {quantity} item{quantity > 1 ? "s" : ""}{" "}
              selected
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

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-black/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg transition hover:bg-black/5 active:scale-95"
                >
                  −
                </button>
                <span className="px-4 text-sm font-semibold min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-lg transition hover:bg-black/5 active:scale-95"
                >
                  +
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div className="opacity-90">
                  <AddToCartButton product={safeProduct} />
                </div>
                <Link
                  href="/checkout"
                  className="w-full text-center rounded-full bg-black text-white dark:bg-white dark:text-black py-3 text-sm font-semibold hover:opacity-90 transition-all duration-300"
                >
                  Buy now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-28">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-20" />
      </div>

      {/* Product Tabs */}
      <div className="mt-20 sm:mt-24 max-w-4xl">
        <div className="flex gap-6 border-b border-black/10 mb-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 transition-all duration-300 ${activeTab === "description" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`pb-3 transition-all duration-300 ${activeTab === "details" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
          >
            Details
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 transition-all duration-300 ${activeTab === "shipping" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
          >
            Shipping
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 transition-all duration-300 ${activeTab === "reviews" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}
          >
            Reviews
          </button>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] text-sm text-gray-600 leading-relaxed">
          {activeTab === "description" && <p>{safeProduct.description}</p>}

          {activeTab === "details" && (
            <ul className="space-y-2">
              <li>• Premium quality product</li>
              <li>• Carefully designed for daily use</li>
              <li>• Category: {safeProduct.category || "General"}</li>
              <li>• Secure checkout and reliable packaging</li>
            </ul>
          )}

          {activeTab === "shipping" && (
            <ul className="space-y-2">
              <li>• Ships within 24 hours</li>
              <li>• Worldwide delivery available</li>
              <li>• Free shipping on orders over $100</li>
              <li>• Tracking number provided after purchase</li>
            </ul>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  4.8
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Customer Rating
                  </p>
                  <p className="text-xs text-gray-500">Based on 124 reviews</p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p>★★★★★ — 82%</p>
                <p>★★★★☆ — 12%</p>
                <p>★★★☆☆ — 4%</p>
                <p>★★☆☆☆ — 1%</p>
                <p>★☆☆☆☆ — 1%</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-28">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-20" />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-28">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-12 text-gray-900 tracking-tight">
            You may also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-w-5xl w-full h-[80vh]">
            <Image
              src={selectedImage || "/placeholder.png"}
              alt={safeProduct.title}
              fill
              sizes="100vw"
              className="object-contain"
            />

            <button
              onClick={() => setZoomOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showStickyCart && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-xl shadow-[0_-20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{safeProduct.title}</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {Number(safeProduct.price).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-black/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg transition hover:bg-black/5 active:scale-95"
                >
                  −
                </button>

                <span className="px-4 text-sm font-semibold min-w-[32px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-lg transition hover:bg-black/5 active:scale-95"
                >
                  +
                </button>
              </div>

              <div className="min-w-[200px]">
                <div className="opacity-90">
                  <AddToCartButton product={safeProduct} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
