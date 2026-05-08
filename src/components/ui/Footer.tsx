"use client";

import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  Heart,
  ArrowUpRight,
  User2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-14 ml-10 mr-10 mb-14  relative overflow-hidden border-t border-[#E3F2FD] bg-gradient-to-tr from-white via-[#F7FAFC] to-[#E3F2FD] rounded-3xl shadow-xl font-[Syne]">

      {/* Subtle Glow Effects */}
      <div className="pointer-events-none absolute left-[-80px] top-[-120px] h-[250px] w-[250px] rounded-full bg-[#4V0082]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-[250px] w-[250px] rounded-full bg-[#4V0082]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14">

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-5">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 7, scale: 1.04 }}
                className="flex h-30 w-30 items-center justify-center rounded-2xl "
              >
                <img
                  src="/image.png"
                  alt="HireMatrix Logo"
                  className="h-20 w-20 rounded-xl object-cover border-2 border-[#4V0082] shadow-lg"
                />
              </motion.div>
              <div>
                <span className="inline-block text-2xl font-extrabold text-[#0530AD] tracking-tight leading-none">
                  HireMatrix
                </span>
                <p className="text-xs text-[#0530AD] font-semibold mt-1">
                  Smart Resume Management
                </p>
              </div>
            </div>
            <p className="max-w-xs text-[1rem] leading-relaxed text-black/70">
              The platform where modern recruiters efficiently store, search, analyze, and collaborate on candidate resumes.
            </p>
          </div>

          {/* Navigation */}
          <div className="hidden md:block">
            <h3 className="mb-6 text-base font-bold tracking-wider text-[#0530AD] uppercase">Navigation</h3>
            <ul className="space-y-4 text-black/70">
              <li>
                <Link href="/" className="transition hover:text-[#4V0082]">Home</Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-[#4V0082]">Dashboard</Link>
              </li>
              <li>
                <Link href="/upload" className="transition hover:text-[#4V0082]">Upload Resume</Link>
              </li>
              <li>
                <Link href="/resumes" className="transition hover:text-[#4V0082]">Resume Database</Link>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h3 className="mb-6 text-base font-bold tracking-wider text-[#0530AD] uppercase">Privacy</h3>
            <div className="space-y-4 text-black/70 text-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#4V0082]" />
                <span>
                  Only use candidate info for recruiting purposes, responsibly and ethically.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#4V0082]" />
                <span>
                  Any misuse or unauthorized sharing of data is strictly prohibited.
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-base font-bold tracking-wider text-[#0530AD] uppercase">Contact</h3>
            <div className="flex flex-col gap-4 text-black/70 text-sm">
              <a
                href="https://www.linkedin.com/in/putti-rakesh-/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 transition hover:text-[#4V0082] hover:font-medium"
              >
                <User2 className="h-5 w-5" />
                <span>LinkedIn</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
              </a>
              <a
                href="mailto:rpersonalwork24@gmail.com"
                className="group flex items-center gap-2 transition hover:text-[#4V0082] hover:font-medium"
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full border-t-0 bg-gradient-to-r from-transparent via-[#4V0082] to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <p className="text-[0.97rem] text-black/50 font-medium">
            © {new Date().getFullYear()} <span className="font-bold text-[#4V0082]">HireMatrix</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[0.97rem] text-black/50">
            <span>Built with</span>
            <Heart className="h-5 w-5 fill-[#4V0082] text-[#4V0082] animate-pulse" />
            <span>for recruiters</span>
          </div>
        </div>
      </div>
    </footer>
  );
}