"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Persist theme
  useEffect(() => {
    const stored = localStorage.getItem("admin-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Orders", href: "/admin/orders", icon: "🧾" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Customers", href: "/admin/customers", icon: "👥" },
  ];

  const breadcrumb = useMemo(() => {
    if (!pathname) return "Admin";
    return pathname
      .replace("/admin", "Admin")
      .split("/")
      .filter(Boolean)
      .join(" / ");
  }, [pathname]);

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex ${
        isDark
          ? "bg-gradient-to-br from-[#0f1115] via-[#0c0e12] to-[#0f1115] text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 border-r shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] ${
          isDark ? "border-white/5 bg-[#111318]/95" : "border-gray-200 bg-white"
        } backdrop-blur-xl flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } hidden md:flex`}
      >
        <div className="px-6 py-6 border-b border-black/5 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-sm font-semibold tracking-wide">
                Admin Panel
              </h1>
              <p className="text-xs opacity-50 mt-1">
                E-commerce Control Center
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition text-xs"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition-all duration-200 ${
                  active
                    ? isDark
                      ? "bg-white/10 text-white"
                      : "bg-gray-200 text-gray-900"
                    : "opacity-60 hover:opacity-100 hover:bg-white/5"
                }`}
              >
                {active && (
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r ${
                      isDark ? "bg-white" : "bg-gray-900"
                    }`}
                  />
                )}

                <span className="text-base">{item.icon}</span>

                {!collapsed && (
                  <span className="tracking-wide">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-6 border-t border-black/5">
          {!collapsed && (
            <Link
              href="/"
              className="text-xs opacity-50 hover:opacity-100 transition"
            >
              ← Back to Store
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header
          className={`sticky top-0 z-20 h-16 border-b backdrop-blur-xl flex items-center justify-between px-8 ${
            isDark
              ? "border-white/5 bg-[#111318]/90"
              : "border-gray-200 bg-white/80"
          }`}
        >
          <div className="text-sm opacity-60 tracking-wide">{breadcrumb}</div>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
              className="text-xs px-3 py-1.5 rounded-lg border transition opacity-70 hover:opacity-100"
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>

            <div
              className={`h-9 w-9 rounded-full ring-1 ${
                isDark
                  ? "bg-white/10 ring-white/10"
                  : "bg-gray-200 ring-gray-300"
              }`}
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
