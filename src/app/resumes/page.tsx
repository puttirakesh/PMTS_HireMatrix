"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  Search,
  MapPin,
  Sparkles,
  Loader2,
  Filter,
  X,
} from "lucide-react";

import { motion } from "framer-motion";

import ResumeCard, {
  type ResumeCardResume,
} from "@/src/components/resumes/ResumeCard";

// =========================================
// AND QUERY PARSER
// =========================================

function parseANDQuery(query: string) {
  if (!query.trim()) return [];

  return query
    .split(",")
    .map((str) => str.trim())
    .filter(Boolean);
}

export default function SearchPage() {
  const { user, isLoaded } = useUser();

  const router = useRouter();

  const [query, setQuery] = useState("");

  const [location, setLocation] = useState("");

  const [resumes, setResumes] = useState<ResumeCardResume[]>([]);

  const [loading, setLoading] = useState(true);

  const [searching, setSearching] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const [openCommentsResumeId, setOpenCommentsResumeId] =
    useState<string | null>(null);

  // =========================================
  // AUTH
  // =========================================

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // =========================================
  // FETCH RESUMES
  // =========================================

  async function fetchResumes() {
    try {
      setSearching(true);

      setFetchError(null);

      const params = new URLSearchParams();

      if (query.trim()) {
        params.set("q", query.trim());
      }

      if (location) {
        params.set("location", location);
      }

      const res = await fetch(
        `/api/resumes/search?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        setFetchError(
          "Unable to load resumes at this time. Please try again later."
        );

        setResumes([]);

        return;
      }

      const data = await res.json();

      setResumes(data);

    } catch (error) {
      setFetchError(
        "Unable to load resumes at this time. Please try again later."
      );

      setResumes([]);

    } finally {
      setLoading(false);

      setSearching(false);
    }
  }

  // =========================================
  // INITIAL FETCH
  // =========================================

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  // =========================================
  // LOCATIONS
  // =========================================

  const locations = useMemo(() => {
    return [
      ...new Set(
        resumes
          .map((r) => r.location)
          .filter(Boolean)
      ),
    ];
  }, [resumes]);

  // =========================================
  // SEARCH
  // =========================================

  async function handleSearch() {
    fetchResumes();
  }

  // =========================================
  // CLEAR
  // =========================================

  async function handleClear() {
    setQuery("");

    setLocation("");

    setLoading(true);

    setFetchError(null);

    setOpenCommentsResumeId(null);

    setTimeout(() => {
      fetchResumes();
    }, 0);
  }

  // =========================================
  // LOADING
  // =========================================

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0530AD]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main
      className="
        min-h-screen
        bg-[var(--background)]
        text-[var(--text)]
        transition-colors duration-500
      "
    >
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#0530AD]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-12"
        >
          <div
            className="
              mb-5 inline-flex items-center gap-2 rounded-full
              border border-[#0530AD]/20
              bg-[#0530AD]/10
              px-5 py-2 text-sm font-medium
              text-[#0530AD]
            "
          >
            <Sparkles className="h-4 w-4" />

            AI Powered Resume Search
          </div>

          <h1 className="text-5xl font-extrabold md:text-6xl">
            Search{" "}

            <span className="text-[#0530AD]">
              Candidates
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-[var(--muted)]">
            Search resumes using keywords,
            AND logic: separate keywords with commas to require all of them.
            Spaces inside phrases will NOT split phrases.
          </p>
        </motion.div>

        {/* SEARCH BOX */}
        <div
          className="
            mb-10 rounded-[32px]
            border border-[var(--border)]
            bg-[var(--card)]
            p-6
            shadow-2xl shadow-blue-900/5
            backdrop-blur
            transition-colors duration-500
          "
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_240px_180px_112px]">

            {/* SEARCH INPUT */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-[#0530AD]">
                Search Keywords / AND Logic
              </label>

              <div className="relative">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0530AD]" />

                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="react, devops engineer, software developer, mongodb"
                  className="
                    w-full rounded-2xl
                    border border-[#0530AD]/20
                    bg-[var(--background)]
                    py-4 pl-14 pr-5
                    text-[var(--text)]
                    outline-none
                    transition-all duration-300
                    placeholder:text-[var(--muted)]
                    focus:border-[#0530AD]
                    focus:ring-4 focus:ring-[#0530AD]/10
                  "
                />
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-[#0530AD]">
                Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0530AD]" />

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="
                    w-full appearance-none rounded-2xl
                    border border-[#0530AD]/20
                    bg-[var(--background)]
                    py-4 pl-14 pr-5
                    text-[var(--text)]
                    outline-none
                    transition-all duration-300
                    focus:border-[#0530AD]
                    focus:ring-4 focus:ring-[#0530AD]/10
                  "
                >
                  <option value="">
                    All Locations
                  </option>

                  {locations.map((loc) => (
                    <option
                      key={loc}
                      value={loc}
                    >
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={searching}
                className="
                  flex h-[58px] w-full items-center justify-center gap-3
                  rounded-2xl
                  bg-[#0530AD]
                  px-6
                  font-semibold text-white
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:bg-[#04278c]
                "
              >
                {searching ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Search
                  </>
                )}
              </button>
            </div>

            {/* CLEAR BUTTON */}
            <div className="flex items-end">
              <button
                onClick={handleClear}
                disabled={searching || (!query && !location)}
                type="button"
                className="
                  flex h-[58px] w-full items-center justify-center gap-2
                  rounded-2xl
                  border border-[#0530AD]/60
                  bg-[var(--background)]
                  font-semibold
                  text-[#0530AD]
                  transition-all duration-300
                  hover:bg-[#0530AD]/10
                "
              >
                <X className="h-5 w-5" />

                Clear
              </button>
            </div>
          </div>

          {/* INFO BOX */}
          <div
            className="
              mt-6 rounded-2xl
              border border-[#0530AD]/10
              bg-[#0530AD]/5
              p-5
            "
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0530AD]">
              <Filter className="h-4 w-4" />

              Keyword Search Format
            </div>

            <div className="space-y-3 text-sm text-[var(--text)]">

              <p>
                Use <span className="font-bold">commas</span> (,) to separate required keywords or phrases (AND logic).
                Words separated by spaces without commas are treated as a single phrase.
              </p>

              <div className="rounded-xl bg-black p-4 font-mono text-sm text-green-400">
                react, devops engineer, software developer, mongodb
              </div>

              <p className="text-[var(--muted)]">
                Search interpretation:
              </p>

              <div
                className="
                  rounded-xl
                  bg-[var(--background)]
                  p-4
                  font-mono text-sm
                  text-[var(--text)]
                "
              >
                Resume must include <b>all</b> of:
                <br />
                "react"
                <br />
                "devops engineer"
                <br />
                "software developer"
                <br />
                "mongodb"
              </div>

              <p>
                Example:
                <span className="mx-1 rounded bg-[var(--background)] px-2 py-1 font-mono">
                  node.js developer
                </span>
                is treated as a single phrase.
              </p>

              <p>
                Example:
                <span className="mx-1 rounded bg-[var(--background)] px-2 py-1 font-mono">
                  node.js, developer
                </span>
                requires both "node.js" AND "developer".
              </p>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--text)]">
            {resumes.length} Resume
            {resumes.length !== 1 && "s"} Found
          </h2>
        </div>

        {/* ERROR */}
        {fetchError ? (
          <div className="rounded-[32px] border border-red-200 bg-red-50 py-24 text-center shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <X className="mx-auto mb-5 h-16 w-16 text-red-400" />

              <h3 className="text-3xl font-bold text-red-600">
                {fetchError}
              </h3>

              <p className="mt-3 text-gray-500">
                Please check your connection or try again.
              </p>
            </div>
          </div>
        ) : resumes.length === 0 ? (

          /* EMPTY */
          <div
            className="
              rounded-[32px]
              border border-[var(--border)]
              bg-[var(--card)]
              py-24 text-center
              shadow-xl
            "
          >
            <Search className="mx-auto mb-5 h-16 w-16 text-[#0530AD]" />

            <h3 className="text-3xl font-bold text-[var(--text)]">
              No Resumes Found
            </h3>

            <p className="mt-3 text-[var(--muted)]">
              Try different keywords or locations.
            </p>
          </div>
        ) : (

          /* GRID */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => {
              return (
                <div
                  key={resume._id}
                  className="relative group"
                >
                  <ResumeCard
                    resume={resume}
                    canDelete={
                      String(resume.userId) ===
                      String(user.id)
                    }
                    onResumeUpdated={(updatedResume) => {
                      setResumes((prev) =>
                        prev.map((r) =>
                          r._id === updatedResume._id
                            ? updatedResume
                            : r
                        )
                      );
                    }}
                    onResumeDeleted={(deletedId) => {
                      setResumes((prev) =>
                        prev.filter(
                          (r) => r._id !== deletedId
                        )
                      );

                      if (
                        openCommentsResumeId === deletedId
                      ) {
                        setOpenCommentsResumeId(null);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}