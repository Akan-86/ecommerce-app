"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import type { Product } from "@/lib/types";
import { Globe2, Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { items, open } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [cartBump, setCartBump] = useState(false);
  const prevCartCount = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

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
    if (cartCount > prevCartCount.current) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 450);
      prevCartCount.current = cartCount;
      return () => clearTimeout(t);
    }

    prevCartCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const q = searchQuery.trim();

    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(q)}`
        );
        const data: unknown = await res.json();

        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 5));
          setShowSuggestions(true);
        }
        setLoadingSuggestions(false);
      } catch (e) {
        console.error("Search suggestion error", e);
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    setShowSuggestions(false);
  }, [pathname]);

  return (
    <header className="nav-blur sticky top-0 z-50">
      <div className="container-modern flex h-16 items-center justify-between text-black dark:text-white">
        <Link
          href="/"
          data-testid="site-logo"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-sm font-bold tracking-tight text-white dark:bg-white dark:text-black">
            V
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">
              Velora
            </span>

            <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-400">
              Modern Essentials
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={lang === "tr" ? "Ürün ara..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value.replace(/^\s+/, ""));
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                  return;
                }
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(
                    `/products?search=${encodeURIComponent(searchQuery)}`
                  );
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              className="w-56 rounded-full border border-black/10 dark:border-white/20 bg-white dark:bg-black px-4 py-2 text-sm outline-none focus:ring-2"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search size={16} />
            </span>
            {showSuggestions && (
              <div
                role="listbox"
                className="absolute left-0 right-0 mt-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-50"
              >
                {loadingSuggestions && (
                  <div
                    aria-live="polite"
                    className="px-4 py-3 text-sm text-brand-600"
                  >
                    {lang === "tr" ? "Aranıyor..." : "Searching..."}
                  </div>
                )}
                {suggestions.map((p) => (
                  <button
                    type="button"
                    role="option"
                    key={String(p.id)}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery("");
                      if (p.id) router.push(`/products/${p.id}`);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-3"
                  >
                    {(p.thumbnail || p.image) && (
                      <img
                        src={p.thumbnail || p.image}
                        alt={p.title || "Product"}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <span className="truncate">{p.title}</span>
                  </button>
                ))}
                {!loadingSuggestions && suggestions.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {lang === "tr" ? "Sonuç bulunamadı" : "No products found"}
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(
                      `/products?search=${encodeURIComponent(searchQuery)}`
                    );
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-semibold border-t hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {lang === "tr" ? "Tüm sonuçları gör" : "View all results"}
                </button>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-4 text-sm font-medium">
            {[
              {
                href: "/products",
                label: lang === "tr" ? "Ürünler" : "Products",
              },
              { href: "/about", label: lang === "tr" ? "Hakkında" : "About" },
              {
                href: "/contact",
                label: lang === "tr" ? "İletişim" : "Contact",
              },
            ].map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-black dark:text-white"
                      : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative flex items-center gap-3" ref={ref}>
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-medium text-neutral-700 backdrop-blur transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
            aria-label="Toggle language"
          >
            <Globe2 size={14} />
            <span>{lang === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}</span>
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/20 px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Toggle mobile menu"
          >
            <span className="text-base">☰</span>
          </button>

          <button
            onClick={open}
            className="relative inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:opacity-95 dark:bg-white dark:text-black"
            aria-label="Open shopping cart"
          >
            <ShoppingBag size={16} />{" "}
            <span className="hidden sm:inline">
              {lang === "tr" ? "Sepet" : "Cart"}
            </span>
            {cartCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 inline-flex min-w-[20px] h-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[11px] font-bold text-white shadow-lg transition-transform duration-300 ${
                  cartBump ? "scale-125 rotate-6" : "scale-100 rotate-0"
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAccountOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-black/10 dark:border-white/20"
            aria-label="Toggle account menu"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-black to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black text-xs font-black">
              {initials || "U"}
            </span>
            {user && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-black/20 px-2 py-0.5 text-xs font-medium">
                {shortEmail}
              </span>
            )}
            {!user && (
              <span className="hidden sm:inline">
                {lang === "tr" ? "Hesap" : "Account"}
              </span>
            )}
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full mt-3 w-60 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-2xl text-brand-900 dark:text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] border border-black/10 dark:border-white/10 z-50 overflow-hidden">
              <div className="p-2">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {lang === "tr" ? "Giriş" : "Login"}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {lang === "tr" ? "Kayıt Ol" : "Register"}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {lang === "tr" ? "Hesabım" : "My Account"}
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {lang === "tr" ? "Siparişler" : "Orders"}
                    </Link>
                    <Link
                      href="/account/settings"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {lang === "tr" ? "Ayarlar" : "Settings"}
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setAccountOpen(false);
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      {lang === "tr" ? "Çıkış" : "Logout"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/85">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 text-sm font-medium">
            <button
              onClick={() => {
                setLang(lang === "tr" ? "en" : "tr");
                setMobileOpen(false);
              }}
              className="rounded-lg px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10"
            >
              {lang === "tr" ? "🇬🇧 Switch to English" : "🇹🇷 Türkçe'ye geç"}
            </button>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              {lang === "tr" ? "Ürünler" : "Products"}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              {lang === "tr" ? "Hakkında" : "About"}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              {lang === "tr" ? "İletişim" : "Contact"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
