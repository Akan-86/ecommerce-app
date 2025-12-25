"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";

export function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      {/* Top utility bar */}
      <div className="bg-gray-900 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1 flex justify-between">
          <span>Free shipping on orders over $50</span>
          <span>Support • Orders • Account</span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-400 text-lg font-extrabold text-gray-900">
              A
            </span>
            <span className="hidden sm:block text-lg font-semibold text-gray-900">
              MyShop
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1">
            <input
              type="text"
              placeholder="Search products"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/products"
              className={`text-sm ${isActive("/products")}`}
            >
              Products
            </Link>

            {user?.role === "admin" && (
              <Link href="/admin" className={`text-sm ${isActive("/admin")}`}>
                Admin
              </Link>
            )}

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

            {user ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className={`text-sm ${isActive("/login")}`}>
                Login
              </Link>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
