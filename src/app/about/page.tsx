import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-10">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <section className="container-modern">
        {/* HERO */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <Sparkles size={14} />
            ABOUT VELORA
          </div>

          <h1 className="section-title text-black dark:text-white">
            Designed for modern everyday living.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Velora curates premium technology, minimalist fashion, and refined
            essentials that combine simplicity, functionality, and timeless
            design.
          </p>
        </div>

        {/* STORY */}
        <div className="mt-24 grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Our Philosophy
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">
              Thoughtful products. Calm experiences.
            </h2>

            <div className="mt-8 space-y-6 text-[17px] leading-8 text-neutral-600 dark:text-neutral-300">
              <p>
                We believe modern ecommerce should feel effortless. Every
                product in the Velora collection is selected to bring clarity,
                quality, and balance into everyday routines.
              </p>

              <p>
                From workspace technology to fashion essentials and lifestyle
                accessories, our goal is to create a seamless shopping
                experience inspired by the world’s most refined brands.
              </p>

              <p>
                Minimal aesthetics, premium materials, and intuitive design sit
                at the center of everything we build.
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                <ShieldCheck size={22} />
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                Premium Quality
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Carefully curated products crafted with attention to detail,
                durability, and modern aesthetics.
              </p>
            </div>

            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                <Globe size={22} />
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                Global Experience
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Built for customers worldwide with a focus on simplicity,
                accessibility, and fast delivery.
              </p>
            </div>

            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:col-span-2">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Velora Mission
              </p>

              <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                Bringing together technology, fashion, and lifestyle through a
                unified premium shopping experience.
              </h3>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-28 rounded-[40px] border border-black/5 bg-neutral-100 px-8 py-16 text-center dark:border-white/10 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-neutral-400">
            Explore Velora
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
            Discover premium essentials designed to elevate your everyday life.
          </h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

            <Link href="/contact" className="btn-luxury btn-luxury-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
