import "./globals.css";
import { type ReactNode } from "react";
import Providers from "@/components/providers";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen text-brand-900 font-sans antialiased transition-colors duration-300 bg-gradient-to-b from-white via-brand-50/40 to-brand-100/40">
        {/* Global background glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/20 blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[600px] rounded-full bg-fuchsia-200/20 blur-3xl" />
        </div>
        <Providers>
          {/* Top info bar */}
          <div className="w-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white text-xs relative z-50 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-between">
              <span className="font-medium">
                🚚 Free shipping on orders over €100
              </span>
              <span className="hidden sm:block text-gray-300">
                New Season · Secure checkout · Easy returns
              </span>
            </div>
          </div>

          {/* Main */}
          <main data-testid="main-content" className="flex-1 pt-24 sm:pt-28">
            {/* Page content wrapper */}
            <section
              data-testid="page-container"
              className="mx-auto max-w-7xl px-4 sm:px-6 py-section-sm lg:py-section min-w-0"
            >
              <div className="animate-[pageEnter_0.4s_ease-out]">
                {children}
              </div>
            </section>
          </main>
        </Providers>
      </body>
    </html>
  );
}
