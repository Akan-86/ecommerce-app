"use client";
import ProductCard from "@/components/product-card";
import { useEffect, useRef, useState } from "react";

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

  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-gray-50/40 to-transparent dark:via-white/3" />
      <div className="flex items-end justify-between mb-16">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/50 mt-4 max-w-sm">
            Curated premium picks just for you
          </p>
        </div>

        <a
          href="/products"
          className="text-sm font-medium text-gray-900 dark:text-white hidden md:inline-flex items-center gap-2 group hover:opacity-80 transition"
        >
          View all
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      <div
        ref={ref}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8"
      >
        {displayProducts.map((product, i) => (
          <div
            key={product.id}
            className={`transform transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <ProductCard
              product={{ ...product, image: product.image || product.imageUrl }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
