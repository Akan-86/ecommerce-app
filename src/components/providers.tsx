"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/context/language-context";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import { CartProvider } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
