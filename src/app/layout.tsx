import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "Demo store with Next.js + DummyJSON",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>
          <Navbar />
          <main className="max-w-[1000px] mx-auto py-6 px-4">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
