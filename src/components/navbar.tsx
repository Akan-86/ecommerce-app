"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { count } = useCart();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Store
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/cart" className="hover:text-blue-600">
            Cart ({count})
          </Link>
        </div>
      </nav>
    </header>
  );
}
