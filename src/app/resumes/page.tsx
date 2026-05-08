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
// AND QUERY PARSER (Comma = split word, no-comma = single phrase)
// =========================================

function parseANDQuery(query: string) {
  if (!query.trim()) return [];
  // Split at commas, trim and filter out empty words
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

  const [resumes, setResumes] = useState<
    ResumeCardResume[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [searching, setSearching] = useState(false);

  // =========================================
  // AUTH CHECK
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
        throw new Error(
          "Failed to fetch resumes"
        );
      }

      const data = await res.json();

      setResumes(data);

    } catch (error) {
      console.error(error);
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
  // UNIQUE LOCATIONS
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
  // SEARCH BUTTON
  // =========================================

  async function handleSearch() {
    fetchResumes();
  }

  // =========================================
  // CLEAR BUTTON
  // =========================================

  async function handleClear() {
    setQuery("");
    setLocation("");
    setLoading(true);
    // After clearing, fetch all resumes (reset filters)
    setTimeout(() => {
      fetchResumes();
    }, 0);
  }

  // =========================================
  // LOADING
  // =========================================

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#0530AD]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-[#0530AD]">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#0530AD]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0530AD]/20 bg-[#0530AD]/10 px-5 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI Powered Resume Search
          </div>

          <h1 className="text-5xl font-extrabold md:text-6xl">
            Search
            <span className="bg-gradient-to-r from-[#0530AD] to-black bg-clip-text text-transparent">
              {" "}Candidates
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-zinc-600">
            Search resumes using keywords,
            AND logic: separate keywords with commas to require all of them. Spaces inside phrases will NOT split phrases.
          </p>
        </motion.div>

        {/* ========================================= */}
        {/* SEARCH BOX */}
        {/* ========================================= */}
        <div className="mb-10 rounded-[32px] border border-[#0530AD]/10 bg-white/90 p-6 shadow-2xl shadow-blue-900/5 backdrop-blur">
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
                  placeholder='react, devops engineer, software developer, mongodb'
                  className="w-full rounded-2xl border border-[#0530AD]/20 bg-white py-4 pl-14 pr-5 text-[#0530AD] outline-none transition-all focus:border-[#0530AD] focus:ring-4 focus:ring-[#0530AD]/10"
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
                  className="w-full appearance-none rounded-2xl border border-[#0530AD]/20 bg-white py-4 pl-14 pr-5 text-[#0530AD] outline-none transition-all focus:border-[#0530AD] focus:ring-4 focus:ring-[#0530AD]/10"
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
                className="flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#0530AD] px-6 font-semibold text-white transition-all hover:scale-[1.02] hover:bg-[#04278c]"
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
                className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl border border-[#0530AD]/60 bg-white text-[#0530AD] font-semibold transition-all hover:bg-[#0530AD]/10"
                title="Clear search and reset filters"
                type="button"
              >
                <X className="h-5 w-5" />
                Clear
              </button>
            </div>
          </div>

          {/* ========================================= */}
          {/* KEYWORD INFO */}
          {/* ========================================= */}
          <div className="mt-6 rounded-2xl border border-[#0530AD]/10 bg-[#0530AD]/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0530AD]">
              <Filter className="h-4 w-4" />
              Keyword Search Format
            </div>

            <div className="space-y-3 text-sm text-zinc-700">
              <p>
                Use <span className="font-bold">commas</span> <span className="font-bold">(,)</span> to separate required keywords or phrases (AND logic). <br />
                Words separated by <span className="font-bold">spaces without commas</span> are treated as a single phrase.
              </p>

              <div className="rounded-xl bg-black p-4 font-mono text-sm text-green-400">
                react, devops engineer, software developer, mongodb
              </div>

              <p className="text-zinc-600">
                Search interpretation:
              </p>

              <div className="rounded-xl bg-zinc-100 p-4 font-mono text-sm text-black">
                Resume must include <b>all</b> of:<br />
                "react"<br />
                "devops engineer"<br />
                "software developer"<br />
                "mongodb"
              </div>

              <p>
                Example: <span className="font-mono bg-zinc-200 px-2 py-1 rounded">node.js developer</span> is treated as a single phrase.<br />
                Example: <span className="font-mono bg-zinc-200 px-2 py-1 rounded">node.js, developer</span> requires both "node.js" AND "developer" (in any order).
              </p>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* RESULTS INFO */}
        {/* ========================================= */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {resumes.length} Resume
            {resumes.length !== 1 && "s"} Found
          </h2>
        </div>

        {/* ========================================= */}
        {/* RESUME GRID */}
        {/* ========================================= */}

        {resumes.length === 0 ? (
          <div className="rounded-[32px] border border-[#0530AD]/10 bg-white/90 py-24 text-center shadow-xl">

            <Search className="mx-auto mb-5 h-16 w-16 text-[#0530AD]" />

            <h3 className="text-3xl font-bold">
              No Resumes Found
            </h3>

            <p className="mt-3 text-zinc-500">
              Try different keywords or locations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                canDelete={
                  String(resume.userId) ===
                  String(user.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}