import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  console.log(
    "🔥 ENV TEST NEXT_PUBLIC_FIREBASE_API_KEY:",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-100 text-gray-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {/* Header */}
              <Navbar />

              {/* Page content */}
              <main className="flex-1 bg-gray-100">
                <div className="mx-auto w-full max-w-7xl px-4 py-6">
                  {children}
                </div>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
