"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { notFound, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import "./globals.css";

// 🌍 Desteklenen diller ve varsayılan dil
const locales = ["en", "tr"] as const;
const defaultLocale = "en";

// 🌐 Mesajlar (statik, Turbopack uyumlu)
const messages = {
  en: {
    Navbar: {
      brand: "MyShop",
      home: "Home",
      cart: "Cart",
      products: "Products",
      about: "About Us",
      contact: "Contact",
      admin: "Admin",
      orders: "Orders",
      logout: "Logout",
      login: "Login",
      light: "Light Mode",
      dark: "Dark Mode",
    },
    Footer: {
      copyright: "All rights reserved.",
    },
  },
  tr: {
    Navbar: {
      brand: "Mağazam",
      home: "Ana Sayfa",
      cart: "Sepet",
      products: "Ürünler", // ✅ eklendi
      about: "Hakkımızda", // ✅ eklendi
      contact: "İletişim", // ✅ eklendi
      admin: "Yönetim",
      orders: "Siparişler",
      logout: "Çıkış",
      login: "Giriş",
      light: "Açık Tema",
      dark: "Koyu Tema",
    },
    Footer: {
      copyright: "Tüm hakları saklıdır.",
    },
  },
};

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const locale = locales.includes(params.locale as any)
    ? params.locale
    : defaultLocale;

  if (!locales.includes(locale)) {
    notFound();
  }

  const pathname = usePathname();
  const [fadeClass, setFadeClass] = useState("opacity-0");

  useEffect(() => {
    // Sayfa değiştiğinde fade-in uygula
    setFadeClass("opacity-100 transition-opacity duration-500");
  }, [pathname]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`bg-white text-black dark:bg-gray-950 dark:text-white transition-colors duration-300 ${fadeClass}`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen max-w-6xl mx-auto px-4 py-6">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
