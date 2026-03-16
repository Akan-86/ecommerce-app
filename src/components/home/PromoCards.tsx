import Link from "next/link";

export default function PromoCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-6">
      {/* SALE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-gray-800 text-white p-10 flex flex-col justify-between min-h-[220px]">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-300">
            Limited Time
          </p>
          <h3 className="text-2xl font-bold mt-2">Summer Sale</h3>
          <p className="text-gray-300 text-sm mt-1">
            Up to 40% off selected products
          </p>
        </div>

        <Link
          href="/products"
          className="mt-6 inline-block w-fit rounded-xl bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-gray-200 transition"
        >
          Shop Deals
        </Link>
      </div>

      {/* NEW ARRIVALS CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-10 flex flex-col justify-between min-h-[220px]">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Just Dropped
          </p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">
            New Arrivals
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Discover the latest products in our collection
          </p>
        </div>

        <Link
          href="/products?sort=new"
          className="mt-6 inline-block w-fit rounded-xl border border-gray-300 px-5 py-2 text-sm font-semibold hover:bg-gray-100 transition"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}
