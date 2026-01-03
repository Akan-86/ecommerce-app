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
      className={`sticky top-0 z-50 w-full bg-white transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}
    >
      {/* Top announcement bar */}
      <div className="bg-gray-900 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1 flex justify-between">
          <span>Free shipping over €50</span>
          <span className="hidden sm:block">
            Secure checkout • Easy returns
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-18 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-400 text-xl font-bold text-gray-900">
              A
            </div>
            <span className="hidden md:block text-xl font-semibold text-gray-900">
              MyShop
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5 shrink-0">
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
              className="relative flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
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
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-2 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Account / Auth */}
            {!loading &&
              (user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
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
                    <div className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg">
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
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
