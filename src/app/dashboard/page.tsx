import { auth } from "@clerk/nextjs/server";
import {
 
  Search,
  FileText,
  Sparkles,

  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Primary theme colors
  const blue = "#0530AD";
  const black = "#0B0B0F";
  const white = "#FFFFFF";
  // Helper classes for badge and cards
  const badgeBg = "bg-[#E3F2FD]";
  const badgeBorder = "border-[#0530AD33]";
  const badgeText = "text-[#0530AD]";

  const LandingHero = ({ loggedIn }: { loggedIn: boolean }) => (
    <main className="min-h-screen overflow-hidden" style={{ background: white, color: black }}>

      {/* BLUE GLOW EFFECTS */}
      <div
        className="absolute left-[-120px] top-[-120px] h-[350px] w-[350px] rounded-full"
        style={{ background: "#0530AD22", filter: "blur(70px)", zIndex: 0 }}
      />
      <div
        className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full"
        style={{ background: "#0530AD11", filter: "blur(70px)", zIndex: 0 }}
      />

      {/* HERO */}
      <section className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        {/* BADGE */}
        <div className={`mb-6 inline-flex items-center gap-2 rounded-full border ${badgeBorder} ${badgeBg} px-5 py-2 text-sm font-medium ${badgeText}`}>
          <Sparkles style={{ color: blue }} className="h-4 w-4" />
          Welcome To HireMatrix Dashboard
        </div>

        {/* TITLE */}
        <h1
          className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
          style={{ color: blue }}
        >
          The Future Of
          <span
            className="bg-clip-text text-transparent"
            style={{
              color: blue,
              backgroundImage: `linear-gradient(90deg, ${blue}, ${blue})`,
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            {" "}Recruitment Workflow
          </span>
        </h1>

        {/* SUBTITLE */}
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 md:text-xl">
          Upload, organize, search, and collaborate on resumes
          with a premium recruiter experience powered by modern
          workflow tools.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {!loggedIn ? (
            <>
              <Link href="/">
                <button
                  className="rounded-2xl bg-gradient-to-r from-[#0530AD] to-[#1e275d] px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-[#0530AD22] transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(90deg, ${blue}, #1e275d)`,
                  }}
                >
                  Get Started
                </button>
              </Link>

              <Link href="/">
                <button
                  className="rounded-2xl border border-[#0B0B0F]/10 bg-[#F7FAFC] px-8 py-4 text-lg font-semibold"
                  style={{ color: blue }}
                >
                  Learn More
                </button>
              </Link>
            </>
          ) : (
            <Link href="/resumes">
              <button
                className="rounded-2xl bg-[#0530AD] px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ background: blue }}
              >
                Start Working
              </button>
            </Link>
       
          )}
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {/* CARD 1 */}
        <div
          className="glass rounded-3xl p-8 border transition duration-300 hover:-translate-y-2"
          style={{
            borderColor: "#E3F2FD",
            background: white,
            boxShadow: `0 2px 12px 0 ${blue}18`,
          }}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#E3F2FD" }}>
            <FileText style={{ color: blue }} className="h-7 w-7" />
          </div>
          <h3 className="mb-3 text-2xl font-bold" style={{ color: black }}>
            Resume Management
          </h3>
          <p className="text-zinc-600">
            Store and organize candidate resumes securely using
            Cloudinary and MongoDB.
          </p>
        </div>

        {/* CARD 2 */}
        <div
          className="glass rounded-3xl p-8 border transition duration-300 hover:-translate-y-2"
          style={{
            borderColor: "#E3F2FD",
            background: white,
            boxShadow: `0 2px 12px 0 ${blue}18`,
          }}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#E3F2FD" }}>
            <Search style={{ color: blue }} className="h-7 w-7" />
          </div>
          <h3 className="mb-3 text-2xl font-bold" style={{ color: black }}>
            Smart Search
          </h3>
          <p className="text-zinc-600">
            Use Boolean search and advanced filters to find
            candidates instantly.
          </p>
        </div>

        {/* CARD 3 */}
        <div
          className="glass rounded-3xl p-8 border transition duration-300 hover:-translate-y-2"
          style={{
            borderColor: "#E3F2FD",
            background: white,
            boxShadow: `0 2px 12px 0 ${blue}18`,
          }}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#E3F2FD" }}>
            <ShieldCheck style={{ color: blue }} className="h-7 w-7" />
          </div>
          <h3 className="mb-3 text-2xl font-bold" style={{ color: black }}>
            Secure Collaboration
          </h3>
          <p className="text-zinc-600">
            Recruiters can collaborate using comments and shared
            workflows securely.
          </p>
        </div>
      </section>
    </main>
  );

  // Not logged in
  if (!userId) {
    return (
      <>
        <LandingHero loggedIn={false} />
      </>
    );
  }

  // Logged in
  return (
    <>
      <LandingHero loggedIn={true} />
    </>
  );
}