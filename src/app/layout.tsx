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
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <AuthProvider>
            <CartProvider>
              {/* Top Header / Promo Bar */}
              <div className="w-full bg-gray-900 text-white text-sm">
                <div className="mx-auto max-w-7xl px-4 py-2 flex justify-between items-center">
                  <span>🚚 Free shipping on orders over €100</span>
                  <span className="hidden sm:block">
                    New Year Sale up to 30% off
                  </span>
                </div>
              </div>

              {/* Main Navbar */}
              <Navbar />

              {/* Page content */}
              <main className="flex-1 bg-gray-50">
                {/* Page content */}
                <div className="mx-auto w-full max-w-7xl px-4 py-10 flex gap-8">
                  {/* Sidebar */}
                  <aside className="hidden lg:block w-64 shrink-0">
                    <Sidebar />
                  </aside>

                  {/* Main page */}
                  <section className="flex-1">{children}</section>
                </div>
              </main>

              {/* Footer */}
              <div className="border-t border-gray-200">
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
