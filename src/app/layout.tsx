import "./globals.css";
import { type ReactNode } from "react";
import { Inter } from "next/font/google";
import ProvidersWrapper from "./providers-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VELORA — Modern E-commerce Store",
  description: "Minimal products. Maximum quality.",
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-white">
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}
      >
        <ProvidersWrapper>
          <div className="fixed top-4 left-6 z-50 text-lg font-semibold tracking-tight">
            VELORA
          </div>
          <main data-testid="main-content" className="flex-1 pt-16">
            <section
              data-testid="page-container"
              className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-10 min-w-0"
            >
              <div className="animate-[pageEnter_0.4s_ease-out]">
                {children}
              </div>
            </section>
          </main>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
