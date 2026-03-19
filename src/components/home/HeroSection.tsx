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
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 grid md:grid-cols-2 items-center gap-12">
        {/* LEFT */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-black leading-tight">
            Minimal products.
            <br />
            Maximum quality.
          </h1>

          <p className="text-gray-500 text-lg max-w-md">
            Carefully curated essentials for everyday life. Designed to last.
          </p>

          <div className="flex gap-4">
            <Link href="/products" className="btn btn-primary-modern">
              Shop now
            </Link>

            <Link href="/categories" className="btn btn-secondary-modern">
              Explore
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <div className="w-[420px] h-[420px] relative">
            {heroProduct?.image ? (
              <Image
                src={heroProduct.image}
                alt={heroProduct.title}
                fill
                className="object-contain"
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
