import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  HelpCircle,
  Package,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const supportTopics = [
  {
    icon: Package,
    title: "Orders & Tracking",
    description:
      "Track orders, view delivery progress, and manage your purchases easily.",
  },
  {
    icon: Truck,
    title: "Shipping Information",
    description:
      "Learn more about delivery timelines, international shipping, and logistics.",
  },
  {
    icon: RefreshCcw,
    title: "Returns & Refunds",
    description:
      "Simple and transparent return policies designed for a seamless experience.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description:
      "Secure checkout support for cards, digital wallets, and modern payment methods.",
  },
  {
    icon: ShieldCheck,
    title: "Account & Security",
    description:
      "Manage your account settings, passwords, and security preferences.",
  },
  {
    icon: HelpCircle,
    title: "General Support",
    description:
      "Need additional help? Our support team is ready to assist you anytime.",
  },
];

export default function HelpCenterPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-10">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <section className="container-modern">
        {/* HERO */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <HelpCircle size={14} />
            HELP CENTER
          </div>

          <h1 className="section-title text-black dark:text-white">
            How can we help you today?
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Find answers to common questions about orders, shipping, returns,
            payments, and your Velora shopping experience.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="rounded-[28px] border border-black/5 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full rounded-2xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* TOPICS */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {supportTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <div
                key={topic.title}
                className="group rounded-[32px] border border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                  <Icon size={22} />
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                  {topic.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                  {topic.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-28 rounded-[40px] border border-black/5 bg-neutral-100 px-8 py-16 text-center dark:border-white/10 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-neutral-400">
            Still Need Help?
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
            Our support team is here to make your experience seamless.
          </h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-luxury btn-luxury-primary group"
            >
              Contact Support
              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link href="/products" className="btn-luxury btn-luxury-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
