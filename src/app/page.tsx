import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import TrustBar from "@/components/home/TrustBar";
import CategoryIcons from "@/components/home/CategoryIcons";
import PromoCards from "@/components/home/PromoCards";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import CategoryBanners from "@/components/home/CategoryBanners";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata = {
  title: "Ecommerce Store",
  description: "Premium fashion, tech and lifestyle products.",
};

export default async function Page() {
  let products: any[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-app-flame-sigma.vercel.app"}/api/products`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      products = data;
    } else {
      console.error("Invalid product data:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

  console.log("PRODUCT COUNT:", products?.length);

  if (!Array.isArray(products)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Data error.</p>
      </main>
    );
  }

  return (
    <main className="relative z-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-gray-50 to-transparent dark:via-white/5" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-28 md:py-36 grid md:grid-cols-2 items-center gap-16">
          {/* LEFT */}
          <div className="space-y-6 max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-wider text-gray-500 dark:text-white/60 uppercase">
              Premium Collection
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              Discover products
              <br />
              that elevate your life
            </h1>

            <p className="text-gray-500 dark:text-white/60 text-base sm:text-lg max-w-md leading-relaxed">
              Modern essentials designed for comfort, quality and style. Built
              for people who value simplicity.
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Shop now
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-gray-500 dark:text-white/60">
              <div>✔ Free shipping</div>
              <div>✔ 30-day returns</div>
              <div>✔ Secure checkout</div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center relative">
            <div className="relative w-[360px] sm:w-[440px] aspect-square rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-black shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-[1.03]">
              {products?.[0]?.imageUrl ? (
                <Image
                  src={products[0].imageUrl}
                  alt={products[0].title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                  Preview
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <CategoryIcons />

      <PromoCards />

      <CategoryGrid />

      <FeaturedProducts products={products} />

      <BestSellers products={products} />

      <CategoryBanners />

      <NewsletterSection />
    </main>
  );
}
