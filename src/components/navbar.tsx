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
    `relative font-medium transition-colors duration-300 ${
      pathname === path
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:text-blue-700 dark:hover:text-blue-500 transition"
        >
          {t("brand")}
        </Link>

        {/* Kategori Menüsü */}
        <div className="hidden md:flex gap-6">
          <Link href="/products" className={linkClasses("/products")}>
            {t("products")}
          </Link>
          <Link href="/about" className={linkClasses("/about")}>
            {t("about")}
          </Link>
          <Link href="/contact" className={linkClasses("/contact")}>
            {t("contact")}
          </Link>
        </div>

        {/* Sağ taraf */}
        <div className="flex gap-4 items-center">
          {/* Arama ikonu */}
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            🔍
          </button>

          {/* Sepet */}
          <Link href="/cart" className={linkClasses("/cart") + " relative"}>
            🛒
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 shadow">
                {count}
              </span>
            )}
          </Link>

          {/* Admin linki */}
          {user?.role === "admin" && (
            <Link href="/admin" className={linkClasses("/admin")}>
              {t("admin")}
            </Link>
          )}

          {/* Siparişler */}
          {user && (
            <Link href="/orders" className={linkClasses("/orders")}>
              {t("orders")}
            </Link>
          )}

          {/* Login / Logout */}
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
