import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const returnSteps = [
  {
    icon: PackageCheck,
    title: "Start Your Return",
    description:
      "Contact our support team with your order number and return request.",
  },
  {
    icon: RefreshCcw,
    title: "Ship the Product",
    description:
      "Securely package your item and send it back using the provided instructions.",
  },
  {
    icon: CheckCircle2,
    title: "Receive Your Refund",
    description:
      "Refunds are processed quickly once your return has been inspected and approved.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-10">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <section className="container-modern">
        {/* HERO */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <RefreshCcw size={14} />
            RETURNS & REFUNDS
          </div>

          <h1 className="section-title text-black dark:text-white">
            Simple and transparent returns.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            We want every Velora experience to feel effortless. If something
            isn’t right, our return and refund process is designed to be clear,
            fair, and stress-free.
          </p>
        </div>

        {/* POLICY GRID */}
        <div className="mt-24 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[36px] border border-black/5 bg-white p-10 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Return Policy
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              30-day return window.
            </h2>

            <div className="mt-8 space-y-6 text-[16px] leading-8 text-neutral-600 dark:text-neutral-300">
              <p>
                Eligible items may be returned within 30 days of delivery in
                their original condition and packaging.
              </p>

              <p>
                Once we receive and inspect the returned item, refunds are
                processed back to the original payment method.
              </p>

              <p>
                Certain personalized, final-sale, or hygiene-sensitive products
                may not qualify for returns.
              </p>
            </div>
          </div>

          <div className="rounded-[36px] border border-black/5 bg-neutral-100 p-10 dark:border-white/10 dark:bg-neutral-900">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
              <ShieldCheck size={26} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Customer-first support.
            </h2>

            <p className="mt-6 text-[16px] leading-8 text-neutral-600 dark:text-neutral-300">
              Our team is committed to making the return process smooth and
              reliable with responsive support and transparent communication.
            </p>

            <div className="mt-10 rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-black/30">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Need assistance?
              </p>

              <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Contact our support team for return eligibility questions,
                shipping updates, or refund status.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center text-sm font-medium text-black transition hover:opacity-70 dark:text-white"
              >
                Contact Support
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* STEPS */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Return Process
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-black dark:text-white">
              Returning an item is easy.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {returnSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-28 rounded-[40px] border border-black/5 bg-black px-8 py-16 text-center text-white dark:border-white/10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
            Explore Velora
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Premium products backed by a customer-first experience.
          </h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="btn-luxury bg-white text-black hover:opacity-90"
            >
              Continue Shopping
            </Link>

            <Link
              href="/help-center"
              className="btn-luxury border border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
