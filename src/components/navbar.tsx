"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[._-]/)
        .filter(Boolean)
        .map((p: string) => p[0].toUpperCase())
        .slice(0, 2)
        .join("")
    : "";
  const shortEmail = user?.email
    ? user.email.length > 18
      ? `${user.email.slice(0, 14)}…`
      : user.email
    : "";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="relative z-50 bg-brand text-white shadow">
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

        <div className="relative flex items-center gap-3" ref={ref}>
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

          <button
            onClick={() => setAccountOpen((v) => !v)}
            className={`relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow transition transform ${
              accountOpen
                ? "bg-white text-slate-900 scale-[1.03]"
                : "bg-white/10 text-white hover:bg-white/20 hover:scale-[1.03]"
            }`}
            aria-label="Toggle account menu"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white text-xs font-black">
              {initials || "U"}
            </span>
            {user && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-black/20 px-2 py-0.5 text-xs font-medium">
                {shortEmail}
              </span>
            )}
            {!user && <span className="hidden sm:inline">Account</span>}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl bg-white text-slate-900 shadow-2xl z-50 overflow-hidden">
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

          {accountOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white text-slate-900 shadow-2xl z-50 overflow-hidden">
              <div className="p-2">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/account/settings"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setAccountOpen(false);
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
