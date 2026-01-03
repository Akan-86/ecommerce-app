"use client";

import Link from "next/link";

export function Header() {
  return (
    <section className="w-full border-b bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Shop smarter.
              <br />
              Discover quality products.
            </h1>

            <p className="max-w-xl text-base text-gray-600 md:text-lg">
              Curated collections, transparent pricing and a smooth checkout
              experience built for modern shopping.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900"
              >
                Browse products
              </Link>

              <Link
                href="/categories"
                className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                View categories
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-100" />
            <div className="relative z-10 rounded-2xl border bg-white p-8 shadow-sm">
              <ul className="space-y-4 text-sm text-gray-700">
                <li>✔ Secure payments</li>
                <li>✔ Fast delivery across Europe</li>
                <li>✔ Easy returns</li>
                <li>✔ Trusted brands</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
