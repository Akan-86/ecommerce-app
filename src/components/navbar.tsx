"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";

export default function Navbar() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-brand text-white shadow">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-black tracking-tight text-xl">
          VentoShop
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:text-brand-accent">
            Products
          </Link>
          <Link href="/about" className="hover:text-brand-accent">
            About
          </Link>
          <Link href="/contact" className="hover:text-brand-accent">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.03] transition"
            aria-label="Toggle cart"
          >
            🛒 <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-6 top-16 w-80 rounded-2xl bg-white text-slate-900 shadow-2xl z-50 overflow-hidden">
              <div className="p-4 max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-600">Your cart is empty.</p>
                ) : (
                  items.map((i) => (
                    <div
                      key={i.product.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div className="pr-2">
                        <p className="text-sm font-semibold leading-tight">
                          {i.product.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {i.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        €{(Number(i.product.price) * i.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t flex items-center justify-between">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold text-brand-accent hover:underline"
                >
                  View Cart
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
