"use client";
import ProductCard from "@/components/product-card";

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  imageUrl?: string;
};

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  const featured = products?.slice(0, 8) || [];

  const fallback = [
    {
      id: "1",
      title: "Black Sunglass",
      price: 89,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    },
    {
      id: "2",
      title: "Modern Desk Lamp",
      price: 49.9,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    },
    {
      id: "3",
      title: "Blue Denim Jean",
      price: 109,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    },
    {
      id: "4",
      title: "Wireless Headphones",
      price: 199,
      image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    },
  ];

  const displayProducts = featured.length ? featured : fallback;

  if (!displayProducts.length) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Featured products
          </h2>

          <a
            href="/products"
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
          >
            View all →
          </a>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, image: product.image || product.imageUrl }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
