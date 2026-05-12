"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Bell,
  Sparkles,
} from "lucide-react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { useTheme } from "next-themes";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme, systemTheme } = useTheme();

  const router = useRouter();
  const pathname = usePathname();

  const { user, isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const effectiveTheme =
    theme === "system" ? systemTheme : theme;

  const navLinks = [
    {
      name: "Home",
      href: "/",
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

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`
        sticky top-0 z-50 w-full
        transition-all duration-500
        ${
          scrolled
            ? "border-b shadow-xl backdrop-blur-2xl"
            : "backdrop-blur-md"
        }
        ${
          effectiveTheme === "dark"
            ? "border-white/10 bg-[#050816]/80"
            : "border-black/10 bg-white/80"
        }
      `}
    >
      {/* BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="
            absolute left-[-100px] top-[-120px]
            h-[240px] w-[240px]
            rounded-full bg-blue-500/10 blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="
            absolute bottom-[-120px] right-[-100px]
            h-[240px] w-[240px]
            rounded-full bg-purple-500/10 blur-3xl
          "
        />
      </div>

      <nav className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center gap-4"
        >
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            className="
              relative flex h-16 w-16 items-center justify-center
              rounded-2xl shadow-xl
            "
          >
            {/* ROTATING BORDER */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                absolute inset-[-2px]
                rounded-2xl border border-blue-300/30
              "
            />

            <Image
              src="/image.png"
              alt="HireMatrix Logo"
              width={48}
              height={48}
              priority
              className="rounded-xl object-cover"
            />
          </motion.div>

          <div>
            <motion.span
              whileHover={{ x: 2 }}
              className={`
                inline-block text-2xl font-extrabold tracking-tight
                ${
                  effectiveTheme === "dark"
                    ? "text-white"
                    : "text-[#0530AD]"
                }
              `}
            >
              HireMatrix
            </motion.span>

            <div className="mt-1 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />

              <p
                className={`
                  text-xs font-semibold
                  ${
                    effectiveTheme === "dark"
                      ? "text-blue-300"
                      : "text-[#0530AD]"
                  }
                `}
              >
                Smart Resume Management
              </p>
            </div>
          </div>
        </Link>

        {/* CENTER NAV */}
        <div
          className={`
            hidden items-center gap-2 rounded-full
            border px-3 py-2 backdrop-blur-xl md:flex
            ${
              effectiveTheme === "dark"
                ? "border-white/10 bg-white/5"
                : "border-black/10 bg-white/60"
            }
          `}
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <motion.div
                key={link.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href={link.href}
                  className={`
                    relative rounded-full px-5 py-2
                    text-sm font-semibold
                    transition-all duration-300
                    ${
                      active
                        ? effectiveTheme === "dark"
                          ? "bg-white/10 text-white"
                          : "bg-blue-100 text-blue-700"
                        : effectiveTheme === "dark"
                        ? "text-gray-200 hover:bg-white/10 hover:text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }
                  `}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <motion.button
            whileHover={{
              scale: 1.08,
              rotate: 5,
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (isSignedIn) {
                router.push("/resumes");
              }
            }}
            disabled={!isSignedIn}
            title={
              isSignedIn
                ? "Go to Resumes"
                : "Login to access resumes"
            }
            className={`
              hidden rounded-full border p-2.5 transition md:flex
              ${
                effectiveTheme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-blue-50"
              }
              ${
                !isSignedIn
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            `}
          >
            <Search className="h-5 w-5 text-blue-500" />
          </motion.button>

          {/* NOTIFICATION */}
          <motion.button
            whileHover={{
              scale: 1.08,
              rotate: -5,
            }}
            whileTap={{ scale: 0.92 }}
            className={`
              relative hidden rounded-full border p-2.5 transition sm:flex
              ${
                effectiveTheme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-blue-50"
              }
            `}
          >
            <Bell className="h-5 w-5 text-blue-500" />

            <motion.span
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="
                absolute right-2 top-2
                h-2 w-2 rounded-full bg-red-500
              "
            />
          </motion.button>

          {/* THEME */}
          <motion.button
            whileHover={{
              scale: 1.08,
              rotate: 180,
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.4 }}
            onClick={() =>
              setTheme(
                effectiveTheme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className={`
              rounded-full border p-2.5 transition-all duration-300
              ${
                effectiveTheme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-blue-50"
              }
            `}
          >
            <AnimatePresence mode="wait">
              {effectiveTheme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{
                    rotate: -180,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 180,
                    opacity: 0,
                  }}
                >
                  <Sun className="h-5 w-5 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{
                    rotate: 180,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -180,
                    opacity: 0,
                  }}
                >
                  <Moon className="h-5 w-5 text-blue-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* USER */}
          {isSignedIn ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className={`
                hidden items-center gap-3
                rounded-full border px-3 py-1.5 sm:flex
                ${
                  effectiveTheme === "dark"
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-blue-50"
                }
              `}
            >
              <div className="text-sm">
                <p
                  className={`font-semibold ${
                    effectiveTheme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {user?.firstName || "User"}
                </p>

                <p className="text-xs text-blue-500">
                  Recruiter
                </p>
              </div>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </motion.div>
          ) : (
            <SignInButton mode="modal">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
                className="
                  rounded-full
                  bg-gradient-to-r
                  from-blue-900 via-blue-700 to-indigo-600
                  px-6 py-2.5
                  text-sm font-semibold text-white
                  shadow-lg shadow-blue-500/30
                "
              >
                Login
              </motion.button>
            </SignInButton>
          )}

          {/* MOBILE BUTTON */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenu(!mobileMenu)}
            className={`
              rounded-xl border p-2 md:hidden
              ${
                effectiveTheme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-blue-50"
              }
            `}
          >
            <AnimatePresence mode="wait">
              {mobileMenu ? (
                <motion.div
                  key="close"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >
                  <X
                    className={
                      effectiveTheme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                >
                  <Menu
                    className={
                      effectiveTheme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{
              opacity: 0,
              y: -25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -25,
            }}
            transition={{
              duration: 0.3,
            }}
            className={`
              overflow-hidden border-t px-6 py-6 backdrop-blur-2xl md:hidden
              ${
                effectiveTheme === "dark"
                  ? "border-white/10 bg-[#050816]/95"
                  : "border-black/10 bg-white/95"
              }
            `}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => {
                const active = pathname === link.href;

                return (
                  <motion.div
                    key={link.name}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.1,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenu(false)}
                      className={`
                        block rounded-xl px-4 py-3
                        text-lg font-semibold transition
                        ${
                          active
                            ? effectiveTheme === "dark"
                              ? "bg-white/10 text-white"
                              : "bg-blue-100 text-blue-700"
                            : effectiveTheme === "dark"
                            ? "text-white hover:bg-white/10"
                            : "text-gray-900 hover:bg-blue-50"
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              {isSignedIn ? (
                <div
                  className={`
                    mt-4 flex items-center gap-3
                    rounded-2xl border p-4
                    ${
                      effectiveTheme === "dark"
                        ? "border-white/10 bg-white/5"
                        : "border-black/10 bg-blue-50"
                    }
                  `}
                >
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />

                  <div>
                    <p
                      className={`font-semibold ${
                        effectiveTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {user?.firstName || "User"}
                    </p>

                    <p className="text-sm text-blue-500">
                      Logged In
                    </p>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      mt-4 w-full rounded-2xl
                      bg-gradient-to-r
                      from-blue-900 via-blue-700 to-indigo-600
                      px-5 py-3
                      text-lg font-semibold text-white
                      shadow-lg shadow-blue-500/30
                    "
                  >
                    Login
                  </motion.button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}