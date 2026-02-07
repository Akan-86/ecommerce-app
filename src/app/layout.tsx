import "./globals.css";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {/* Top info bar */}
              <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs">
                <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
                  <span className="font-medium">
                    🚚 Free shipping on orders over €100
                  </span>
                  <span className="hidden sm:block text-gray-300">
                    New Season · Secure checkout · Easy returns
                  </span>
                </div>
              </div>

              {/* Navbar */}
              <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
                <Navbar />
              </header>

              {/* Main */}
              <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                  {/* Page content */}
                  <section className="min-w-0">{children}</section>
                </div>
              </main>

              {/* Footer */}
              <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-12">
                  <Footer />
                </div>
              </footer>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
