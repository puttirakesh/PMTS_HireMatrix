"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

// Providers component wraps children with theme and toast notification support
//
// To support black/white themes with manual switching (e.g. from a navbar icon),
// - Use ThemeProvider as below
// - Navbar can use the `useTheme` hook from next-themes to toggle the theme between "light" and "dark"
// - Entire site will reflect the theme because `attribute="class"` sets a class of "light" or "dark" on <html> (or <body> if set so)
// - You need to implement and mount a toggle (icon/button) in your Navbar using useTheme, not here.

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider
        attribute="class"                // Adds "light" or "dark" class to <html>
        defaultTheme="light"             // Use "light" as default for classic black/white
        enableSystem={false}             // Only manual switching, no OS-based theme
        disableTransitionOnChange        // Prevent transitions on theme change
        themes={["light", "dark"]}       // Only allow "light" and "dark"
      >
        {children}
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
    </>
  );
}