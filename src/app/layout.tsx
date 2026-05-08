import type { Metadata } from "next";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import Navbar from "@/src/components/ui/Navbar";

import Footer from "@/src/components/ui/Footer";

import Providers from "@/src/components/Providers";

export const metadata: Metadata = {
  title: "HireMatrix",

  description:
    "Professional Resume Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>

      <html
        lang="en"
        suppressHydrationWarning
      >

        <body suppressHydrationWarning>

          <Providers>

            <div className="min-h-screen bg-[white] text-white">

              <Navbar />

              <main>
                {children}
              </main>

              <Footer />

            </div>

          </Providers>

        </body>

      </html>

    </ClerkProvider>
  );
}