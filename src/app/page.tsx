import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import {
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  // REDIRECT LOGGED-IN USERS
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main
      className="relative mt-10 min-h-screen overflow-hidden"
      style={{
        background: "var(--background)",
        color: "var(--text)",
      }}
    >
      {/* GLOW EFFECTS */}

      <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-[#0530AD]/20 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-[#0530AD]/10 blur-3xl" />

      {/* HERO */}

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* BADGE */}

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0530AD]/20 bg-[#0530AD]/10 px-5 py-2 text-sm font-medium text-[#0530AD]">
          <Sparkles className="h-4 w-4" />

          AI-Powered Resume Platform
        </div>

        {/* TITLE */}

        <h1
          className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
          style={{
            color: "#0530AD",
          }}
        >
          Recruit Smarter With

          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #0530AD 60%, #0B0B0F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {" "}HireMatrix
          </span>
        </h1>

        {/* SUBTITLE */}

        <p
          className="mt-8 max-w-3xl text-lg leading-relaxed md:text-xl"
          style={{
            color: "var(--muted)",
          }}
        >
          Store, search, organize, and collaborate on resumes
          with an ultra-modern recruiter workflow powered by
          smart search and elegant UI.
        </p>

        {/* BUTTONS */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <SignUpButton mode="modal">
            <button className="rounded-2xl bg-[#0530AD] px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-[#0530AD]/20 transition-all duration-300 hover:scale-105 hover:bg-[#04278c]">
              Get Started
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button
              className="rounded-2xl border px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                borderColor: "#0530AD55",
                background: "var(--card)",
                color: "#0530AD",
              }}
            >
              Sign In
            </button>
          </SignInButton>
        </div>

        {/* FEATURE CARDS */}

        <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {/* CARD 1 */}

          <div
            className="rounded-3xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0530AD]/10">
              <FileText className="h-7 w-7 text-[#0530AD]" />
            </div>

            <h3
              className="mb-3 text-2xl font-bold"
              style={{
                color: "var(--text)",
              }}
            >
              Resume Storage
            </h3>

            <p
              style={{
                color: "var(--muted)",
              }}
            >
              Securely upload and organize candidate resumes.
            </p>
          </div>

          {/* CARD 2 */}

          <div
            className="rounded-3xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0530AD]/10">
              <Search className="h-7 w-7 text-[#0530AD]" />
            </div>

            <h3
              className="mb-3 text-2xl font-bold"
              style={{
                color: "var(--text)",
              }}
            >
              Smart Search
            </h3>

            <p
              style={{
                color: "var(--muted)",
              }}
            >
              Boolean search and advanced filtering system.
            </p>
          </div>

          {/* CARD 3 */}

          <div
            className="rounded-3xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0530AD]/10">
              <ShieldCheck className="h-7 w-7 text-[#0530AD]" />
            </div>

            <h3
              className="mb-3 text-2xl font-bold"
              style={{
                color: "var(--text)",
              }}
            >
              Secure Collaboration
            </h3>

            <p
              style={{
                color: "var(--muted)",
              }}
            >
              Collaborate on candidate profiles safely and efficiently.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}