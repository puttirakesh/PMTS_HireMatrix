"use client";

import { ThemeProvider } from "next-themes";

import { Toaster } from "react-hot-toast";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >

      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#fff",
            border:
              "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />

    </ThemeProvider>
  );
}