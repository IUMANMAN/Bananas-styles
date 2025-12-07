import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pumpbanana - AI Style Collection",
  description: "Discover and create amazing AI styles.",
  icons: {
    icon: '/bananas-icon.ico',
  },
};

import { LanguageProvider } from "@/contexts/LanguageContext";

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-50 min-h-screen")}>
        <LanguageProvider>
          <NavBar />
          <main className="pt-48 md:pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
