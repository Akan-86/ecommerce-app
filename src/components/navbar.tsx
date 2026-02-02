"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useRef } from "react";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();

      fetch(`/api/products?q=${query}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setSuggestions(data.map((p: any) => p.name));
        })
        .catch(() => {});

      return () => controller.abort();
    }, 250);
  }, [query]);

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-yellow-400 after:rounded-full after:transition-all after:duration-300"
      : "text-gray-600 hover:text-gray-900 relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300";

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-b from-yellow-100/90 via-white/80 to-transparent"
      }`}
    >
      {/* Top bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1 flex justify-between">
          <span>Free shipping over €50</span>
          <span className="hidden sm:block">
            Secure checkout • Easy returns
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-300 text-lg font-extrabold text-gray-900 shadow">
              A
            </div>
            <span className="hidden md:block text-lg font-semibold text-gray-900">
              MyShop
            </span>
          </Link>
          <button
            className="md:hidden rounded-md p-2 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Search */}
          <div className="relative hidden md:flex flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full max-w-2xl rounded-full border border-gray-300 bg-white/90 px-5 py-2.5 text-sm shadow focus:border-gray-900 focus:outline-none"
            />
            {query && (
              <div className="absolute top-full mt-2 w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                {suggestions
                  .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setQuery("");
                        router.push(`/products?search=${item}`);
                      }}
                    >
                      {item}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3 shrink-0">
            <Link
              href="/products"
              className={`text-sm font-medium ${isActive("/products")}`}
            >
              Products
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium ${isActive("/admin")}`}
              >
                Admin
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-2 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!loading &&
              (user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10z"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      {user.email?.split("@")[0]}
                    </span>
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 px-5 py-2 text-sm font-semibold text-gray-900 shadow hover:opacity-90"
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden border-t border-gray-200 bg-white shadow transition-all duration-300 ease-out ${
          mobileOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-3"
        }`}
      >
        <div className="px-4 py-4 space-y-3">
          <input
            type="text"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-2"></div>
          <Link href="/products" className="block text-sm font-medium">
            Products
          </Link>

          <Link href="/cart" className="block text-sm font-medium">
            Cart ({count})
          </Link>

          {user ? (
            <>
              <Link href="/account" className="block text-sm font-medium">
                Account
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="block text-sm font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
