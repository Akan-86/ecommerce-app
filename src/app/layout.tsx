/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import "./globals.css";
import { type ReactNode } from "react";
import { useEffect, useState } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import ProvidersWrapper from "./providers-wrapper";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

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
        className={`${inter.className} min-h-screen bg-[var(--brand-bg-soft)] text-[var(--brand-text-primary)] antialiased transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] tracking-tight`}
      >
        <ProvidersWrapper>
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-transparent via-white/40 to-transparent dark:via-white/5 pointer-events-none" />
          <div className="fixed top-4 left-6 z-50 flex items-center gap-4 backdrop-blur-md bg-white/60 dark:bg-black/40 px-4 py-2 rounded-full border border-black/5 dark:border-white/10">
            <div
              className={`${playfair.className} text-lg font-semibold tracking-tight`}
            >
              VELORA
            </div>
            <button
              onClick={toggleTheme}
              className="text-xs px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:scale-105 transition"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <main data-testid="main-content" className="flex-1 pt-20">
            <section
              data-testid="page-container"
              className="mx-auto max-w-7xl px-4 sm:px-6 section min-w-0"
            >
              <div className="animate-[fadeIn_0.6s_ease] will-change-[opacity,transform]">
                {children}
              </div>
            </section>
          </main>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
