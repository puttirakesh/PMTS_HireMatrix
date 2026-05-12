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

  const blue = "#0530AD";

  const LandingHero = ({
    loggedIn,
  }: {
    loggedIn: boolean;
  }) => (
    <main
      className="min-h-screen overflow-hidden transition-colors duration-500"
      style={{
        background: "var(--background)",
        color: "var(--text)",
      }}
    >
      {/* BLUE GLOW */}
      <div
        className="absolute left-[-120px] top-[-120px] h-[350px] w-[350px] rounded-full blur-[70px]"
        style={{
          background: "#0530AD22",
          zIndex: 0,
        }}
      />

      <div
        className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full blur-[70px]"
        style={{
          background: "#0530AD11",
          zIndex: 0,
        }}
      />

      {/* HERO */}
      <section className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">

        {/* BADGE */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium"
          style={{
            borderColor: "#0530AD33",
            background: "#E3F2FD",
            color: blue,
          }}
        >
          <Sparkles
            style={{ color: blue }}
            className="h-4 w-4"
          />

          Welcome To HireMatrix Dashboard
        </div>

        {/* TITLE */}
        <h1
          className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
          style={{
            color: "var(--text)",
          }}
        >
          The Future Of

          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #0530AD, #2563eb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {" "}
            Recruitment Workflow
          </span>
        </h1>

        {/* SUBTITLE */}
        <p
          className="mt-8 max-w-3xl text-lg leading-relaxed md:text-xl"
          style={{
            color: "var(--muted)",
          }}
        >
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
                  className="rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(90deg, #0530AD, #1e275d)",
                    boxShadow:
                      "0 10px 30px rgba(5,48,173,0.25)",
                  }}
                >
                  Get Started
                </button>
              </Link>

              <Link href="/">
                <button
                  className="rounded-2xl border px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--card)",
                    color: blue,
                  }}
                >
                  Learn More
                </button>
              </Link>
            </>
          ) : (
            <Link href="/resumes">
              <button
                className="rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: blue,
                  boxShadow:
                    "0 10px 30px rgba(5,48,173,0.25)",
                }}
              >
                Start Working
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">

        {/* CARD 1 */}
        <FeatureCard
          icon={<FileText className="h-7 w-7" />}
          title="Resume Management"
          description="Store and organize candidate resumes securely using Cloudinary and MongoDB."
        />

        {/* CARD 2 */}
        <FeatureCard
          icon={<Search className="h-7 w-7" />}
          title="Smart Search"
          description="Use Boolean search and advanced filters to find candidates instantly."
        />

        {/* CARD 3 */}
        <FeatureCard
          icon={<ShieldCheck className="h-7 w-7" />}
          title="Secure Collaboration"
          description="Recruiters can collaborate using comments and shared workflows securely."
        />
      </section>
    </main>
  );

  if (!userId) {
    return <LandingHero loggedIn={false} />;
  }

  return <LandingHero loggedIn={true} />;
}

/* FEATURE CARD */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        glass
        rounded-3xl
        border
        p-8
        transition-all
        duration-300
        hover:-translate-y-2
      "
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        color: "var(--text)",
        boxShadow:
          "0 2px 12px rgba(5,48,173,0.08)",
      }}
    >
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: "#E3F2FD",
          color: "#0530AD",
        }}
      >
        {icon}
      </div>

      <h3
        className="mb-3 text-2xl font-bold"
        style={{
          color: "var(--text)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "var(--muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}