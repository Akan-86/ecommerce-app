"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

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
  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!query) return setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetch(`/api/products?q=${query}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setSuggestions(data.map((p: any) => p.name)))
        .catch(() => {});
    }, 250);
  }, [query]);

  const isActive = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold border-b-2 border-yellow-400"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-white shadow" : "bg-white/80 backdrop-blur"}`}
    >
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1 flex justify-between">
          <span>🚚 Free shipping over €50</span>
          <span className="hidden sm:block">
            🔒 Secure checkout • Easy returns
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-300 text-lg font-extrabold text-gray-900 shadow">
              A
            </div>
            <span className="hidden md:block text-lg font-semibold text-gray-900">
              MyShop
            </span>
          </Link>

          {/* Search (Desktop) */}
          <div className="relative hidden md:flex flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full max-w-2xl rounded-full border px-5 py-2.5 text-sm shadow focus:border-gray-900 focus:outline-none"
            />
            {query && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full max-w-2xl rounded-lg border bg-white shadow-lg">
                {suggestions.map((item) => (
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

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-3">
            <Link href="/products" className={isActive("/products")}>
              Products
            </Link>

            {isAdmin && (
              <Link href="/admin" className={isActive("/admin")}>
                Admin
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center">
              <span className="text-xl">🛒</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
                  {count}
                </span>
              )}
            </Link>

            {/* Account */}
            {!loading &&
              (user ? (
                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 border rounded-full hover:bg-gray-100"
                  >
                    👤{" "}
                    <span className="hidden sm:inline">
                      {user.email?.split("@")[0]}
                    </span>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow">
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="px-4 py-2 border rounded-full">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-yellow-400 rounded-full font-semibold"
                  >
                    Register
                  </Link>
                </div>
              ))}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border px-4 py-2"
            />
            <Link href="/products" className="block">
              Products
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block">
                Admin
              </Link>
            )}
            <Link href="/cart" className="block">
              Cart
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
