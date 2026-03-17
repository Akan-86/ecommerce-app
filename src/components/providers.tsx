"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/language-context";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import { CartProvider } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/home/footer";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {/* Navbar is here */}
              <Navbar />

              <main className="flex-1">{children}</main>

              {/* Footer is here */}
              <Footer />
            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
