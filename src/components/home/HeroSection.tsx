import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Product = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
};

export default function HeroSection({ products }: { products: Product[] }) {
  const heroProduct = products?.[0];

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-10 md:px-6 md:pb-28 md:pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <div className="container-modern grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            CURATED MODERN ESSENTIALS
          </div>

          <h1 className="hero-title text-neutral-950 dark:text-white">
            Elevate your
            <br />
            everyday setup.
          </h1>

          <p className="hero-subtitle mt-8">
            Discover refined technology, minimalist fashion, and premium
            essentials designed for modern living.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="btn-luxury btn-luxury-primary group"
            >
              Shop Collection
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link href="/about" className="btn-luxury btn-luxury-secondary">
              About Velora
            </Link>
          </div>

          {/* Trust metrics */}
          <div className="mt-14 grid grid-cols-3 gap-8 border-t border-black/10 pt-8 dark:border-white/10">
            <div>
              <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                12K+
              </p>
              <p className="mt-1 text-sm text-neutral-500">Premium customers</p>
            </div>

            <div>
              <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                4.9
              </p>
              <p className="mt-1 text-sm text-neutral-500">Average rating</p>
            </div>

            <div>
              <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                48H
              </p>
              <p className="mt-1 text-sm text-neutral-500">Global delivery</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          {/* floating glow */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neutral-200/60 blur-3xl dark:bg-white/10" />

          <div className="relative overflow-hidden rounded-[36px] border border-black/5 bg-neutral-100 shadow-[0_30px_80px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-neutral-900">
            {heroProduct?.image ? (
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.title}
                  fill
                  priority
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* floating card */}
                <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/20 bg-white/75 p-5 shadow-2xl backdrop-blur-xl dark:bg-black/40">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        Featured Product
                      </p>

                      <h3 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                        {heroProduct.title}
                      </h3>
                    </div>

                    <div className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
                      ${heroProduct.price}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-neutral-400">
                Preview
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
