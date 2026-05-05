"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function Header() {
  const { lang } = useLanguage();
  return (
    <section className="w-full border-b bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {lang === "tr" ? "Daha akıllı alışveriş yap." : "Shop smarter."}
              <br />
              {lang === "tr"
                ? "Kaliteli ürünleri keşfet."
                : "Discover quality products."}
            </h1>

            <p className="max-w-xl text-base text-gray-600 md:text-lg">
              {lang === "tr"
                ? "Özenle seçilmiş ürünler, şeffaf fiyatlandırma ve modern alışveriş için akıcı bir ödeme deneyimi."
                : "Curated collections, transparent pricing and a smooth checkout experience built for modern shopping."}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900"
              >
                {lang === "tr" ? "Ürünleri incele" : "Browse products"}
              </Link>

              <Link
                href="/categories"
                className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {lang === "tr" ? "Kategorileri gör" : "View categories"}
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-100" />
            <div className="relative z-10 rounded-2xl border bg-white p-8 shadow-sm">
              <ul className="space-y-4 text-sm text-gray-700">
                <li>✔ {lang === "tr" ? "Güvenli ödeme" : "Secure payments"}</li>
                <li>✔ {lang === "tr" ? "Hızlı teslimat" : "Fast delivery"}</li>
                <li>✔ {lang === "tr" ? "Kolay iade" : "Easy returns"}</li>
                <li>
                  ✔ {lang === "tr" ? "Güvenilir markalar" : "Trusted brands"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
