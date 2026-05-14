import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-10">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <section className="container-modern">
        {/* HERO */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <MessageCircle size={14} />
            CONTACT VELORA
          </div>

          <h1 className="section-title text-black dark:text-white">
            We’d love to hear from you.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            Questions, feedback, or partnership inquiries? Our team is here to
            help you with anything related to your Velora experience.
          </p>
        </div>

        {/* CONTENT */}
        <div className="mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT INFO */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                <Mail size={22} />
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                Email Support
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Reach out anytime and our support team will respond within 24
                hours.
              </p>

              <p className="mt-6 text-sm font-medium text-black dark:text-white">
                support@velora-shop.com
              </p>
            </div>

            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                <Phone size={22} />
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                Phone
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Monday to Friday from 9:00 AM to 6:00 PM.
              </p>

              <p className="mt-6 text-sm font-medium text-black dark:text-white">
                +44 20 7946 0958
              </p>
            </div>

            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                <MapPin size={22} />
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                Headquarters
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Velora Studio
                <br />
                London, United Kingdom
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-[36px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900 md:p-10">
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Send a message
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                Let’s start a conversation.
              </h2>
            </div>

            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="John"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="How can we help you?"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Tell us more about your request..."
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="btn-luxury btn-luxury-primary group w-full justify-center"
              >
                Send Message
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-neutral-400">
            Explore Velora
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
            Discover premium essentials crafted for modern everyday living.
          </h2>

          <div className="mt-10">
            <Link
              href="/products"
              className="btn-luxury btn-luxury-primary inline-flex items-center group"
            >
              Shop Collection
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
