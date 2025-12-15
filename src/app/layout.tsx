import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
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
      search: "Search products",
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
      search: "Ürün ara",
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
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  {children}
                </div>
              </main>
              <Footer />
            </CartProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
