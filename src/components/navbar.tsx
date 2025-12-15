"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isActive = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="grid h-16 grid-cols-12 items-center gap-4">
          {/* Logo */}
          <div className="col-span-2 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-sm font-extrabold text-gray-900">
                A
              </span>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                MyShop
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="col-span-6 hidden md:block">
            <input
              type="text"
              placeholder={t("search")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="col-span-4 flex items-center justify-end gap-4">
            <Link
              href="/products"
              className={`text-sm ${isActive("/products")}`}
            >
              {t("products")}
            </Link>

            {user?.role === "admin" && (
              <Link href="/admin" className={`text-sm ${isActive("/admin")}`}>
                {t("admin")}
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {t("logout")}
              </button>
            ) : (
              <Link
                href="/login"
                className={`text-sm font-medium ${isActive("/login")}`}
              >
                {t("login")}
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-2xl">🛒</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-2 rounded-full bg-red-600 px-1.5 text-xs text-white">
                  {count}
                </span>
              )}
            </Link>

            {/* Theme toggle and Language */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                {theme === "dark" ? t("light") : t("dark")}
              </button>

              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
