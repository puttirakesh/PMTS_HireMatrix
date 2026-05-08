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
    <>
      <main className="mt-10 relative min-h-screen overflow-hidden bg-white text-black mb-10">
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
          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl" style={{ color: "#0530AD" }}>
            Recruit Smarter With
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #0530AD 60%, #0B0B0F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}HireMatrix
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-black/70 md:text-xl">
            Store, search, organize, and collaborate on resumes
            with an ultra-modern recruiter workflow powered by
            smart search and elegant UI.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="rounded-2xl bg-[#0530AD] px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-[#0530AD]/20 transition-all duration-300 hover:scale-105 hover:bg-[#0530AD]/90">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="rounded-2xl border border-[#0530AD]/70 bg-white px-8 py-4 text-lg font-semibold text-[#0530AD] transition-all hover:bg-[#0530AD]/5 hover:text-[#0530AD]">
                Sign In
              </button>
            </SignInButton>
          </div>

          {/* FEATURE CARDS */}
          <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">

            {/* CARD 1 */}
            <div className="rounded-3xl p-8 transition hover:-translate-y-2 bg-[#F7F9FC] shadow">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0530AD]/10">
                <FileText className="h-7 w-7 text-[#0530AD]" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#0B0B0F]">
                Resume Storage
              </h3>
              <p className="text-black/60">
                Securely upload and organize candidate resumes.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="rounded-3xl p-8 transition hover:-translate-y-2 bg-[#F7F9FC] shadow">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0530AD]/10">
                <Search className="h-7 w-7 text-[#0530AD]" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#0B0B0F]">
                Smart Search
              </h3>
              <p className="text-black/60">
                Boolean search and advanced filtering system.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="rounded-3xl p-8 transition hover:-translate-y-2 bg-[#F7F9FC] shadow">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0530AD]/10">
                <ShieldCheck className="h-7 w-7 text-[#0530AD]" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#0B0B0F]">
                Secure Collaboration
              </h3>
              <p className="text-black/60">
                Collaborate on candidate profiles safely and efficiently.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}