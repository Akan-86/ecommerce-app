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
    <section className="relative isolate overflow-hidden bg-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />

      {/* Background image */}
      {heroProduct?.image && (
        <div className="absolute inset-0 opacity-40">
          <Image
            src={heroProduct.image}
            alt={heroProduct.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="text-white space-y-6 max-w-xl">
          <span className="text-sm uppercase tracking-widest text-gray-400">
            Premium Collection
          </span>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Shop smarter.
          </h1>

          <p className="text-gray-300 text-lg">
            Discover curated products across fashion, tech and lifestyle. Built
            for quality, designed for everyday life.
          </p>

          <div className="flex gap-4 pt-2">
            <Link
              href="/products"
              className="px-7 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Browse Products
            </Link>

            <Link
              href="/categories"
              className="px-7 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
            >
              Categories
            </Link>
          </div>
        </div>

        {/* RIGHT PRODUCT */}
        <div className="hidden md:flex justify-end">
          <div className="relative w-[420px] h-[420px]">
            {heroProduct?.image ? (
              <Image
                src={heroProduct.image}
                alt={heroProduct.title}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                Product preview
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
