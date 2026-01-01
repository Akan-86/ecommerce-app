"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const { count } = useCart();
  const { user, logout, loading, isAdmin } = useAuth();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow ${
        scrolled ? "shadow-md" : "border-b border-gray-200"
      }`}
    >
      {/* Top strip */}
      <div className="bg-gray-900 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1 flex justify-between">
          <span>Free shipping over $50</span>
          <span className="hidden sm:block">
            Secure checkout • Easy returns
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-400 text-lg font-extrabold text-gray-900">
              A
            </div>
            <span className="hidden md:block text-lg font-semibold text-gray-900">
              MyShop
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 mx-6">
            <input
              type="text"
              placeholder="Search products"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/products"
              className={`text-sm ${isActive("/products")}`}
            >
              Products
            </Link>

            {isAdmin && (
              <Link href="/admin" className={`text-sm ${isActive("/admin")}`}>
                Admin
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-3 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Account */}
            {loading ? null : (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-base">👤</span>
                  <span className="hidden sm:inline">
                    {user ? user.email?.split("@")[0] : "Sign in"}
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                    {user ? (
                      <>
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
                          onClick={() => {
                            setAccountOpen(false);
                            logout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
