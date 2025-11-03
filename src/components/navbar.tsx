"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { LanguageSwitcher } from "@/components/language-switcher"; // 🌍 dil değiştirici

export function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { theme, setTheme } = useTheme();

  const linkClasses = (path: string) =>
    `relative font-medium transition ${
      pathname === path
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:text-blue-700 dark:hover:text-blue-500 transition"
        >
          {t("brand")}
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/" className={linkClasses("/")}>
            {t("home")}
          </Link>

          <Link href="/cart" className={linkClasses("/cart")}>
            {t("cart")}
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow">
                {count}
              </span>
            )}
          </Link>

          {user?.role === "admin" && (
            <Link href="/admin" className={linkClasses("/admin")}>
              {t("admin")}
            </Link>
          )}

          {user && (
            <Link href="/orders" className={linkClasses("/orders")}>
              {t("orders")}
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              {t("logout")}
            </button>
          ) : (
            <Link href="/login" className={linkClasses("/login")}>
              {t("login")}
            </Link>
          )}

          {/* 🌗 Tema geçişi */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? t("light") : t("dark")}
          </button>

          {/* 🌍 Dil değiştirici */}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
