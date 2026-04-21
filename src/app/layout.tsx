/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import "./globals.css";
import { type ReactNode } from "react";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import ProvidersWrapper from "./providers-wrapper";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);

    document.documentElement.classList.remove("dark");
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);

    document.documentElement.classList.remove("dark");
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <html
      lang="en"
      className={`h-full scroll-smooth ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-screen bg-[var(--brand-bg-soft)] text-[var(--brand-text-primary)] antialiased transition-colors duration-300`}
      >
        <ProvidersWrapper>
          <div className="fixed top-4 left-6 z-50 flex items-center gap-4">
            <div className="text-lg font-semibold tracking-tight">VELORA</div>
            <button
              onClick={toggleTheme}
              className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:scale-105 transition"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <main data-testid="main-content" className="flex-1 pt-16">
            <section
              data-testid="page-container"
              className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-10 min-w-0"
            >
              <div className="fade-in-soft">{children}</div>
            </section>
          </main>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
