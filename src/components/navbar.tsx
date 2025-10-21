"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context"; // 🔑 kullanıcı bilgisi

export function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth(); // 🔑 user.uid varsa giriş yapılmış demektir
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `relative font-medium transition ${
      pathname === path
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

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
          <Link href="/" className={linkClasses("/")}>
            Home
          </Link>

          <Link href="/cart" className={linkClasses("/cart")}>
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow">
                {count}
              </span>
            )}
          </Link>

          {user?.role === "admin" && (
            <Link href="/admin" className={linkClasses("/admin")}>
              Admin
            </Link>
          )}

          {user && (
            <Link href="/orders" className={linkClasses("/orders")}>
              Orders
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className={linkClasses("/login")}>
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
