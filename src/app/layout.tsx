import "./globals.css";
import Navbar from "@/components/navbar";
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
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased transition-colors duration-300">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {/* Top info bar */}
              <div className="w-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white text-xs relative z-50 shadow-sm">
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
              <div className="relative z-50">
                <Navbar />
              </div>

              {/* Main */}
              <main className="flex-1 pt-28">
                {/* Page content wrapper */}
                <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16 min-w-0">
                  <div className="fade-in transition-all duration-300">
                    {children}
                  </div>
                </section>
              </main>

              {/* Footer */}
              <footer className="border-t border-gray-200 bg-gray-100/60 backdrop-blur-sm">
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
