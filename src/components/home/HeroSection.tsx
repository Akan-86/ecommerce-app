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
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="text-white space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Discover Premium Products
          </h1>

          <p className="text-gray-300 max-w-lg">
            Explore our curated collection of fashion, tech and lifestyle
            products designed for quality, style and everyday use.
          </p>

          <div className="flex gap-4">
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Shop Now
            </Link>

            <Link
              href="/categories"
              className="px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        {/* RIGHT PRODUCT PREVIEW */}
        <div className="relative h-[420px] w-full">
          {heroProduct?.image ? (
            <Image
              src={heroProduct.image}
              alt={heroProduct.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              Product preview
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
