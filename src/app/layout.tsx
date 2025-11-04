import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "./globals.css";

// 🌍 Desteklenen diller ve varsayılan dil
const locales = ["en", "tr"] as const;
const defaultLocale = "en";

// 🌐 Mesajlar (statik, Turbopack uyumlu)
const messages = {
  en: {
    Navbar: {
      home: "Home",
      cart: "Cart",
    },
    Footer: {
      copyright: "All rights reserved.",
    },
  },
  tr: {
    Navbar: {
      home: "Ana Sayfa",
      cart: "Sepet",
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-gray-950 dark:text-white transition-colors duration-300">
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
