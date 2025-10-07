"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition"
        >
          Store
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
