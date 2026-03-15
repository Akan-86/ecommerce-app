"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function Navbar() {
  const { items, open } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const prevCartCount = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(q)}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (e) {
        console.error("Search suggestion error", e);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    setShowSuggestions(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-250 ${
        scrolled
          ? "bg-white/95 shadow-card border-brand-200"
          : "bg-white/70 border-brand-100"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between text-brand-900">
        <Link
          href="/"
          data-testid="site-logo"
          className="group font-black tracking-tight text-xl flex items-center gap-2"
        >
          <span className="text-xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
            Velora
            <span className="text-[var(--brand-primary)] group-hover:opacity-80">
              .
            </span>
          </span>
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
              className="w-64 rounded-xl border border-brand-200 bg-white/80 px-4 py-2 text-sm outline-none focus:ring-2 backdrop-blur"
              style={{ outlineColor: "var(--brand-primary)" }}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60">
              🔍
            </span>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-xl border border-brand-200 bg-white shadow-lg overflow-hidden z-50">
                {suggestions.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery("");
                      router.push(`/products/${p.id}`);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-brand-100 flex items-center gap-3"
                  >
                    {(p.thumbnail || p.image) && (
                      <img
                        src={p.thumbnail || p.image}
                        alt={p.title}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <span className="truncate">{p.title}</span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(
                      `/products?search=${encodeURIComponent(searchQuery)}`
                    );
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-semibold border-t hover:bg-brand-100"
                >
                  {lang === "tr" ? "Tüm sonuçları gör" : "View all results"}
                </button>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-8 text-sm font-medium">
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
                  className={`group relative transition-colors duration-300 ${
                    active
                      ? "text-brand-900"
                      : "text-brand-600 hover:text-brand-900"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-transform duration-300 ease-out ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative flex items-center gap-3" ref={ref}>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold hover:bg-brand-100 transition"
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>

          <button
            onClick={open}
            className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold btn-primary hover:scale-[1.05] active:scale-[0.97] transition-all duration-250"
            aria-label="Open shopping cart"
          >
            🛒{" "}
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
            className={`relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow transition transform ${
              accountOpen
                ? "bg-white text-slate-900 scale-[1.03]"
                : "bg-white border border-brand-200 text-brand-900 hover:shadow-card hover:scale-[1.03]"
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
            {!user && (
              <span className="hidden sm:inline">
                {lang === "tr" ? "Hesap" : "Account"}
              </span>
            )}
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full mt-3 w-60 rounded-3xl bg-white text-brand-900 shadow-elevated border border-brand-200 z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-2">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-100"
                    >
                      {lang === "tr" ? "Giriş" : "Login"}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-100"
                    >
                      {lang === "tr" ? "Kayıt Ol" : "Register"}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-100"
                    >
                      {lang === "tr" ? "Hesabım" : "My Account"}
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-100"
                    >
                      {lang === "tr" ? "Siparişler" : "Orders"}
                    </Link>
                    <Link
                      href="/account/settings"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-100"
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
        <div className="md:hidden border-t border-brand-200 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 text-sm font-medium">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-brand-100"
            >
              {lang === "tr" ? "Ürünler" : "Products"}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-brand-100"
            >
              {lang === "tr" ? "Hakkında" : "About"}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-brand-100"
            >
              {lang === "tr" ? "İletişim" : "Contact"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
