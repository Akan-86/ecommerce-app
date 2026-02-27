"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { items, open } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 400);
    return () => clearTimeout(t);
  }, [cartCount]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        scrolled
          ? "bg-white/95 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] border-black/10"
          : "bg-white/70 border-black/5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-slate-900">
        <Link
          href="/"
          className="group font-black tracking-tight text-xl flex items-center gap-1"
        >
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            Vento
          </span>
          <span className="text-[var(--brand-primary)] transition-all duration-300 group-hover:tracking-wide">
            Shop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[
            { href: "/products", label: "Products" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative transition-colors duration-300 ${
                  active
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-[var(--brand-primary)] transition-transform duration-300 ease-out ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="relative flex items-center gap-3" ref={ref}>
          <button
            onClick={open}
            className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold btn-primary hover:scale-[1.05] active:scale-[0.97] transition-all duration-300"
            aria-label="Toggle cart"
          >
            🛒 <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 inline-flex min-w-[20px] h-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[11px] font-bold text-white shadow-lg transition-transform duration-300 ${
                  cartBump ? "scale-125" : "scale-100"
                }`}
              >
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
            <div className="absolute right-0 top-full mt-3 w-60 rounded-3xl bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-black/5 z-50 overflow-hidden backdrop-blur-xl">
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
