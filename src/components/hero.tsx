import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-yellow-50 via-white to-white">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Discover products you’ll love
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Premium quality products, fast delivery and secure checkout.
          Everything you need — in one place.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
          >
            Shop now
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Browse products
          </Link>
        </div>
      </div>
    </section>
  );
}
