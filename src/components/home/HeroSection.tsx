import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
};

export default function HeroSection({ products }: { products: Product[] }) {
  const heroProduct = products?.[0];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold leading-tight text-neutral-900 dark:text-white">
            Designed for modern living
          </h1>

          <p className="text-neutral-500 max-w-md">
            Minimal, functional and premium products curated for everyday life.
          </p>

          <div className="flex gap-4">
            <Link
              href="/products"
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-md text-sm font-medium"
            >
              Shop now
            </Link>

            <Link
              href="/products"
              className="border border-neutral-200 dark:border-white/20 px-6 py-3 rounded-md text-sm"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden relative">
          {heroProduct?.image ? (
            <Image
              src={heroProduct.image}
              alt={heroProduct.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-400 text-sm">
              Preview
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
