"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const { items, open } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
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
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-black/5 shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-slate-900">
        <Link href="/" className="font-black tracking-tight text-xl">
          <span>Vento</span>
          <span style={{ color: "var(--brand-primary)" }}>Shop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/products"
            className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--brand-primary)] after:transition-all hover:after:w-full"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--brand-primary)] after:transition-all hover:after:w-full"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--brand-primary)] after:transition-all hover:after:w-full"
          >
            Contact
          </Link>
        </nav>

        <div className="relative flex items-center gap-3" ref={ref}>
          <button
            onClick={open}
            className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold btn-primary hover:scale-[1.05] active:scale-[0.97] transition-all duration-300"
            aria-label="Toggle cart"
          >
            🛒 <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex min-w-[20px] h-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[11px] font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAccountOpen((v) => !v)}
            className={`relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow transition transform ${
              accountOpen
                ? "bg-white text-slate-900 scale-[1.03]"
                : "bg-white border border-black/10 text-slate-900 hover:shadow-md hover:scale-[1.03]"
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

          {accountOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white text-slate-900 shadow-xl border border-black/5 z-50 overflow-hidden">
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
