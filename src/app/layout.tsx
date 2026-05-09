import "./globals.css";
import { type ReactNode } from "react";
import { Inter } from "next/font/google";
import ProvidersWrapper from "./providers-wrapper";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.className} min-h-screen bg-white text-black antialiased`}
      >
        <ProvidersWrapper>
          <main data-testid="main-content" className="min-h-screen">
            {children}
          </main>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
