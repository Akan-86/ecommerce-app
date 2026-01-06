import "./globals.css";
import { Navbar } from "@/components/navbar";
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
              {/* Promo / Top bar */}
              <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm">
                <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
                  <span className="font-medium">
                    🚚 Free shipping on orders over €100
                  </span>
                  <span className="hidden sm:block text-gray-300">
                    New Year Sale · Up to 30% off
                  </span>
                </div>
              </div>

              {/* Navbar */}
              <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
                <Navbar />
              </header>

              {/* Main content area */}
              <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12 flex gap-8">
                  {/* Sidebar */}
                  <aside className="hidden lg:block w-64 shrink-0">
                    <Sidebar />
                  </aside>

                  {/* Page content */}
                  <section className="flex-1 min-w-0">{children}</section>
                </div>
              </main>

              {/* Footer */}
              <footer className="border-t border-gray-200 bg-white">
                <Footer />
              </footer>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
