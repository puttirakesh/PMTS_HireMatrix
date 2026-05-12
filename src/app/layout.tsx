import type { Metadata } from "next";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import Navbar from "@/src/components/ui/Navbar";

import Footer from "@/src/components/ui/Footer";

import Providers from "@/src/components/Providers";

export const metadata: Metadata = {
  title: "HireMatrix",
  description: "Professional Resume Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
        <body suppressHydrationWarning>
        <ClerkProvider>
          <Providers>
            <div
              className="
                min-h-screen
                bg-[var(--background)] text-[var(--text)]
                transition-colors duration-500
              "
            >
              <Navbar />

              <main>{children}</main>

              <Footer />
            </div>
          </Providers>
          </ClerkProvider>
        </body>
      </html>
    
  );
}