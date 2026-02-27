"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Products", href: "/admin/products" },
    { label: "Customers", href: "/admin/customers" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#111318] px-6 py-8 hidden md:flex flex-col">
        <div className="mb-10">
          <h1 className="text-lg font-semibold tracking-wide">Admin Panel</h1>
          <p className="text-xs text-white/40 mt-1">E-commerce Management</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-2 text-sm transition-all duration-200 ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white transition"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#111318] flex items-center justify-between px-6">
          <div className="text-sm text-white/60">
            {pathname.replace("/admin", "Admin")}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-white/10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-[#0f1115]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
