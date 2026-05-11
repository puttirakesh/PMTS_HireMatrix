"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Bell,
} from "lucide-react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { useTheme } from "next-themes";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  // Ensure theme is accessed on client to prevent hydration mismatch
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { user, isSignedIn } = useUser();

  const navLinks = [
    {
      name: "Home",
      href: "/"
    },
    {
      name: "Upload",
      href: "/upload",
    },
    {
      name: "Resumes",
      href: "/resumes",
    },
  ];

  // We only render theme UI after mounting, to prevent SSR/CSR mismatch
  function renderThemeToggle() {
    if (!mounted) return null;
    // Use resolved theme for icon display
    const effectiveTheme = theme === "system" ? systemTheme : theme;
    return (
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
        onClick={() =>
          setTheme(effectiveTheme === "dark" ? "light" : "dark")
        }
        className="rounded-full border border-black/10 bg-blue-50 p-2.5 transition"
      >
        {effectiveTheme === "dark" ? (
          <Sun className="h-5 w-5 text-blue-700" />
        ) : (
          <Moon className="h-5 w-5 text-blue-700" />
        )}
      </motion.button>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-4">
        <div className=" flex items-left gap-4">
              <motion.div
                whileHover={{ rotate: 7, scale: 1.04 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl "
              >
                <img
                  src="/image.png"
                  alt="HireMatrix Logo"
                  className="h-15 w-15 rounded-xl object-cover border-2 border-[#4V0082] shadow-lg"
                />
              </motion.div>
              <div>
                <span className="mt-4 inline-block text-2xl font-extrabold text-[#0530AD] tracking-tight leading-none">
                  HireMatrix
                </span>
                <p className="text-xs text-[#0530AD] font-semibold mt-1">
                  Smart Resume Management
                </p>
              </div>
            </div>
        </Link>
  
        {/* CENTER LINKS */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-black hover:text-blue-700 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="hidden rounded-full border border-black/10 bg-blue-50 p-2.5 transition md:flex"
          >
            <Search className="h-5 w-5 text-blue-700" />
          </motion.button>

          {/* NOTIFICATIONS */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="hidden rounded-full border border-black/10 bg-blue-50 p-2.5 transition sm:flex"
          >
            <Bell className="h-5 w-5 text-blue-700" />
          </motion.button>

          {/* THEME */}
          {renderThemeToggle()}

          {/* USER */}
          {isSignedIn ? (
            <div className="hidden items-center gap-3 rounded-full border border-black/10 bg-blue-50 px-3 py-1.5 sm:flex">
              <div className="text-sm">
                <p className="font-semibold text-black">
                  {user?.firstName || "User"}
                </p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-gradient-to-r from-blue-900 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                Login
              </motion.button>
            </SignInButton>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-black/10 bg-blue-50 p-2 md:hidden"
          >
            {mobileMenu ? (
              <X className="text-black" />
            ) : (
              <Menu className="text-black" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.25 }}
            className="border-t border-black/10 bg-white px-6 py-6 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-lg font-semibold text-black transition hover:text-blue-700"
                >
                  {link.name}
                </Link>
              ))}

              {/* THEME TOGGLE FOR MOBILE */}
              <div className="flex justify-start mt-2">
                {renderThemeToggle()}
              </div>

              {isSignedIn ? (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 bg-blue-50 p-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                  <div>
                    <p className="font-semibold text-black">
                      {user?.firstName || "User"}
                    </p>
                    <p className="text-sm text-blue-700">
                      Logged In
                    </p>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 px-5 py-2 text-lg font-semibold text-white shadow-lg shadow-blue-500/20"
                  >
                    Login
                  </motion.button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}