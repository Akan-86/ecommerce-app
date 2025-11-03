import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "next-themes"; // 🌗 theme
import { NextIntlProvider } from "next-intl"; // 🌍 language
import "./globals.css";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlProvider locale={params.locale}>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen max-w-6xl mx-auto px-4 py-6">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </NextIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
