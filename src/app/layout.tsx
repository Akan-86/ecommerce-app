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
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />

            <main className="min-h-screen w-full">{children}</main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
