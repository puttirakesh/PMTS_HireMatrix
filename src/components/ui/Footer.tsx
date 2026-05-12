"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ShieldCheck,
  ArrowUpRight,
  User2,
  HeartIcon,
  Sparkles,
  LayoutDashboard,
  Upload,
  Database,
  Send,
} from "lucide-react";

import { motion, Variants } from "framer-motion";

// Use Framer's Easing object instead of plain string for "ease".
// "ease" should be an accepted Easing type like [0.42, 0, 0.58, 1] or "easeOut" from framer-motion.
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1], // Use cubic-bezier as Easing, this is similar to "easeOut"
    },
  },
};

export default function Footer() {
  const navLinks = [
    {
      label: "Home",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Upload Resume",
      href: "/upload",
      icon: Upload,
    },
    {
      label: "Resume Database",
      href: "/resumes",
      icon: Database,
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="
        relative
        mx-4 mb-8 mt-16
        overflow-hidden
        rounded-[2.5rem]
        border border-white/20
        bg-white/70
        shadow-[0_20px_80px_rgba(5,48,173,0.12)]
        backdrop-blur-3xl
        dark:border-white/10
        dark:bg-[#081120]/90
        sm:mx-8
        lg:mx-10
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glow 1 */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            // "ease" on motion component allows string
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[-120px]
            top-[-120px]
            h-[320px]
            w-[320px]
            rounded-full
            bg-blue-500/10
            blur-3xl
            dark:bg-blue-700/20
          "
        />

        {/* Glow 2 */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[-140px]
            right-[-100px]
            h-[300px]
            w-[300px]
            rounded-full
            bg-indigo-500/10
            blur-3xl
            dark:bg-indigo-700/20
          "
        />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(5,48,173,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(5,48,173,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 dark:from-white/[0.03] dark:to-transparent" />
      </div>

      {/* FLOATING ICONS */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="
          absolute left-[12%] top-[18%]
          text-blue-400/20
          dark:text-blue-300/20
        "
      >
        <Sparkles className="h-5 w-5" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="
          absolute right-[15%] top-[28%]
          text-indigo-400/20
          dark:text-indigo-300/20
        "
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* TOP */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            grid grid-cols-1 gap-12
            md:grid-cols-5
          "
        >
          {/* BRAND */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-2"
          >
            <div className="mb-6 flex items-center gap-4">
              {/* LOGO */}
              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="
                  relative
                  flex h-20 w-20
                  items-center justify-center
                "
              >
                {/* Animated Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.4, 0.15, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="
                    absolute inset-0
                    rounded-3xl
                    border border-blue-400/40
                  "
                />

                {/* Glow */}
                <div
                  className="
                    absolute inset-0
                    rounded-3xl
                    bg-blue-500/20
                    blur-2xl
                  "
                />

                <div
                  className="
                    relative z-10
                    rounded-3xl
                    border border-white/20
                    bg-white/70
                    p-3
                    shadow-2xl
                    backdrop-blur-xl
                    dark:bg-[#172344]/80
                  "
                >
                  <Image
                    src="/image.png"
                    alt="HireMatrix Logo"
                    width={52}
                    height={52}
                    priority
                    className="rounded-2xl object-cover"
                  />
                </div>
              </motion.div>

              {/* TEXT */}
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="
                    text-3xl
                    font-extrabold
                    tracking-tight
                    text-[#0530AD]
                    dark:text-white
                  "
                >
                  HireMatrix
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="
                    mt-1
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#0530AD]
                    dark:text-white/80
                  "
                >
                  Smart Resume Management
                </motion.p>
              </div>
            </div>

            <motion.p
              variants={fadeUp}
              className="
                max-w-md
                text-sm
                leading-relaxed
                text-black/65
                dark:text-white/80
              "
            >
              The modern AI-powered platform where recruiters can upload,
              organize, search, and collaborate on candidate resumes with
              speed, simplicity, and elegance.
            </motion.p>

            {/* SOCIALS */}
            <div className="mt-7 flex items-center gap-4">
              {/* LINKEDIN */}
              <motion.a
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.linkedin.com/in/putti-rakesh-/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative
                  flex h-12 w-12 items-center justify-center
                  overflow-hidden
                  rounded-2xl
                  border border-white/20
                  bg-white/60
                  text-[#0530AD]
                  shadow-xl
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:bg-blue-50
                  dark:bg-[#162448]/70
                  dark:text-white
                "
              >
                <div className="absolute inset-0 bg-blue-500/0 transition-all duration-300 group-hover:bg-blue-500/10" />
                <User2 className="relative z-10 h-5 w-5" />
              </motion.a>

              {/* EMAIL */}
              <motion.a
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:rpersonalwork24@gmail.com"
                className="
                  group relative
                  flex h-12 w-12 items-center justify-center
                  overflow-hidden
                  rounded-2xl
                  border border-red-300/30
                  bg-gradient-to-br
                  from-red-500
                  via-orange-500
                  to-yellow-500
                  text-white
                  shadow-2xl shadow-red-500/20
                "
              >
                <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10" />

                <Mail className="relative z-10 h-5 w-5" />
              </motion.a>

              {/* WHATSAPP */}
              <motion.a
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/918121270909"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative
                  flex h-12 w-12 items-center justify-center
                  overflow-hidden
                  rounded-2xl
                  border border-white/20
                  bg-white/60
                  text-[#25D366]
                  shadow-xl
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:bg-green-50
                  dark:bg-[#163326]/70
                  dark:text-white
                "
              >
                <div className="absolute inset-0 bg-green-500/0 transition-all duration-300 group-hover:bg-green-500/10" />

                <Send className="relative z-10 h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* NAVIGATION */}
          <motion.div variants={fadeUp}>
            <h3
              className="
                mb-5
                text-sm
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#0530AD]
                dark:text-white
              "
            >
              Navigation
            </h3>

            <ul className="space-y-4">
              {navLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.label}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      href={item.href}
                      className="
                        group flex items-center gap-3
                        text-sm font-medium
                        text-black/70
                        transition-all duration-300
                        hover:text-[#0530AD]
                        dark:text-white/80
                        dark:hover:text-blue-300
                      "
                    >
                      <div
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-xl
                          border border-white/20
                          bg-white/60
                          shadow-lg
                          backdrop-blur-xl
                          dark:bg-[#162448]/70
                        "
                      >
                        <Icon className="h-4 w-4 text-[#0530AD] dark:text-blue-300" />
                      </div>

                      {item.label}

                      <ArrowUpRight
                        className="
                          ml-auto h-4 w-4
                          opacity-0
                          transition-all duration-300
                          group-hover:translate-x-1
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* PRIVACY */}
          <motion.div variants={fadeUp}>
            <h3
              className="
                mb-5
                text-sm
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#0530AD]
                dark:text-white
              "
            >
              Privacy
            </h3>

            <div className="space-y-4">
              {[
                "Use candidate information responsibly and ethically.",
                "Unauthorized sharing or misuse is prohibited.",
              ].map((text, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="
                    flex gap-3
                    rounded-3xl
                    border border-white/20
                    bg-white/50
                    p-4
                    shadow-lg
                    backdrop-blur-xl
                    dark:bg-[#162448]/70
                  "
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0530AD] dark:text-blue-300" />

                  <span
                    className="
                      text-sm
                      leading-relaxed
                      text-black/70
                      dark:text-white/80
                    "
                  >
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div variants={fadeUp}>
            <h3
              className="
                mb-5
                text-sm
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#0530AD]
                dark:text-white
              "
            >
              Contact
            </h3>

            <div className="flex flex-col gap-4">
              <motion.a
                whileHover={{
                  scale: 1.02,
                  x: 3,
                }}
                whileTap={{ scale: 0.98 }}
                href="https://www.linkedin.com/in/putti-rakesh-/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-3
                  rounded-3xl
                  border border-white/20
                  bg-white/50
                  px-4 py-3
                  shadow-lg
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:bg-blue-50/70
                  dark:bg-[#162448]/70
                "
              >
                <User2 className="h-5 w-5 text-[#0530AD] dark:text-blue-300" />

                <span
                  className="
                    text-sm font-medium
                    text-black/80
                    dark:text-white
                  "
                >
                  LinkedIn
                </span>

                <ArrowUpRight
                  className="
                    ml-auto h-4 w-4
                    opacity-0
                    transition-all duration-300
                    group-hover:translate-x-1
                    group-hover:opacity-100
                  "
                />
              </motion.a>

              <motion.a
                whileHover={{
                  scale: 1.02,
                  x: 3,
                }}
                whileTap={{ scale: 0.98 }}
                href="mailto:rpersonalwork24@gmail.com"
                className="
                  group flex items-center gap-3
                  rounded-3xl
                  border border-white/20
                  bg-white/50
                  px-4 py-3
                  shadow-lg
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:bg-blue-50/70
                  dark:bg-[#162448]/70
                "
              >
                <Mail className="h-5 w-5 text-[#0530AD] dark:text-blue-300" />

                <span
                  className="
                    text-sm font-medium
                    text-black/80
                    dark:text-white
                  "
                >
                  Email
                </span>

                <ArrowUpRight
                  className="
                    ml-auto h-4 w-4
                    opacity-0
                    transition-all duration-300
                    group-hover:translate-x-1
                    group-hover:opacity-100
                  "
                />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* DIVIDER */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="
            my-10 h-px w-full origin-center
            bg-gradient-to-r
            from-transparent
            via-[#0530AD]
            to-transparent
            dark:via-white/20
          "
        />

        {/* BOTTOM */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            flex flex-col items-center
            justify-between gap-4
            md:flex-row
          "
        >
          <motion.p
            variants={fadeUp}
            className="
              text-sm font-medium
              text-black/70
              dark:text-white/70
            "
          >
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-[#0530AD] dark:text-white">
              HireMatrix
            </span>
            . All rights reserved.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="
              flex items-center gap-2
              text-sm
              text-black/70
              dark:text-white/70
            "
          >
            <span>Made with</span>

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <HeartIcon className="h-5 w-5 fill-[#0530AD] text-[#0530AD] dark:fill-white dark:text-white" />
            </motion.div>

            <span>by Rakesh Putti</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}