import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Globe,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

const shippingFeatures = [
  {
    icon: Truck,
    title: "Fast Worldwide Delivery",
    description:
      "Reliable international shipping with trusted logistics partners.",
  },
  {
    icon: Clock3,
    title: "Quick Processing",
    description:
      "Orders are processed within 1–2 business days before dispatch.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description:
      "Velora delivers to customers across multiple countries and regions.",
  },
];

export default function ShippingPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-10">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <section className="container-modern">
        {/* HERO */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <Truck size={14} />
            SHIPPING INFORMATION
          </div>

          <h1 className="section-title text-black dark:text-white">
            Fast, secure, and global delivery.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Velora partners with trusted shipping providers to ensure your
            products arrive quickly, safely, and reliably wherever you are.
          </p>
        </div>

        {/* FEATURES */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {shippingFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                  <Icon size={22} />
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                  {feature.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* DELIVERY INFO */}
        <div className="mt-24 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[36px] border border-black/5 bg-white p-10 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Delivery Timeline
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Estimated shipping times.
            </h2>

            <div className="mt-8 space-y-6 text-[16px] leading-8 text-neutral-600 dark:text-neutral-300">
              <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5 dark:border-white/10">
                <span>United Kingdom</span>
                <span className="font-medium text-black dark:text-white">
                  1–3 business days
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5 dark:border-white/10">
                <span>Europe</span>
                <span className="font-medium text-black dark:text-white">
                  3–7 business days
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5 dark:border-white/10">
                <span>North America</span>
                <span className="font-medium text-black dark:text-white">
                  5–10 business days
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span>International</span>
                <span className="font-medium text-black dark:text-white">
                  7–14 business days
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[36px] border border-black/5 bg-neutral-100 p-10 dark:border-white/10 dark:bg-neutral-900">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
              <ShieldCheck size={26} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Safe & protected delivery.
            </h2>

            <p className="mt-6 text-[16px] leading-8 text-neutral-600 dark:text-neutral-300">
              Every order is securely packaged and shipped with tracking support
              to ensure a smooth delivery experience from checkout to arrival.
            </p>

            <div className="mt-10 rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-black/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                <Package size={20} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Tracking Included
              </p>

              <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                You’ll receive a tracking confirmation email once your order has
                been shipped.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-28 rounded-[40px] border border-black/5 bg-black px-8 py-16 text-center text-white dark:border-white/10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
            Continue Exploring
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Premium essentials delivered with speed and reliability.
          </h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="btn-luxury bg-white text-black hover:opacity-90"
            >
              Shop Collection
            </Link>

            <Link
              href="/help-center"
              className="btn-luxury border border-white/20 bg-transparent text-white hover:bg-white/10 group"
            >
              Visit Help Center
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
