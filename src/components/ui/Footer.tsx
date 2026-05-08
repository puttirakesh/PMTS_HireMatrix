import { Code2, Heart, LinkIcon, Mail, Quote } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left – Logo & Description */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Putti Rakesh</h3>
                <p className="text-xs text-slate-500">Full‑Stack Developer</p>
              </div>
            </div>

            <p className="text-slate-400 max-w-md">
              Building thoughtful digital experiences with clean code and clear purpose.
            </p>

            <div className="flex items-center gap-6 mt-8">
              <a
                href="https://www.linkedin.com/in/putti-rakesh-/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
              <a
                href="mailto:rpersonalwork24@gmail.com"
                className="hover:text-white transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links (optional section) */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-5">Navigate</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Quotes */}
          <div className="md:col-span-4">
            <h4 className="text-white font-semibold mb-5">Contact</h4>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <a
                  href="mailto:rpersonalwork24@gmail.com"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  rpersonalwork24@gmail.com
                </a>
              </div>

              <div>
                <p className="text-sm text-slate-500">LinkedIn</p>
                <a
                  href="https://www.linkedin.com/in/putti-rakesh-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Putti Rakesh
                </a>
              </div>
            </div>

            {/* Quotes section */}
            <div className="mt-10 space-y-4">
              <div className="flex gap-2">
                <Quote className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                <p className="italic text-slate-500 text-sm leading-relaxed">
                  “The only way to do great work is to love what you do.”
                </p>
              </div>
              <div className="flex gap-2">
                <Quote className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                <p className="italic text-slate-500 text-sm leading-relaxed">
                  “Simplicity is the soul of efficiency.”
                </p>
              </div>
              <p className="text-xs mt-2 text-slate-600">— Personal mantras</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© {new Date().getFullYear()} Putti Rakesh. All rights reserved.</p>

          <div className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500" /> in India
          </div>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}