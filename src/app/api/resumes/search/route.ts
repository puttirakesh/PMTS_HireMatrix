import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import dbConnect from "@/src/lib/db";

import Resume from "@/src/models/Resume";

// =========================================
// AND SEARCH SUPPORT
// =========================================

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";

    const location = searchParams.get("location") || "";

    const filters: any[] = [];

    // AND SEARCH
    if (q.trim()) {
      filters.push(
        buildAndSearch(q)
      );
    }

    // LOCATION FILTER
    if (location) {
      filters.push({
        location: {
          $regex: location,
          $options: "i",
        },
      });
    }

    const mongoQuery =
      filters.length > 0
        ? { $and: filters }
        : {};

    const resumes = await Resume.find(mongoQuery)
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      resumes
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

// =========================================
// Instead of splitting on spaces, only split by comma
// So phrases with spaces ("devops engineer") are preserved as a single keyword
// Enforce AND matches: All terms split by commas must match (in any field)
// =========================================

function parseAndKeywords(query: string) {
  if (!query.trim()) return [];

  // Split ONLY by commas, preserve phrases with spaces
  // e.g. "react, devops engineer" => ["react", "devops engineer"]
  return query
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

// =========================================
// AND SEARCH BUILDER
// =========================================

function buildAndSearch(query: string) {
  const keywords = parseAndKeywords(query);

  // Example:
  // react, devops engineer
  //
  // =>
  // (react AND devops engineer)
  // i.e. All must be matched (in any field)

  // For each keyword, build an $or for fields
  // Then use $and for all keywords

  return {
    $and: keywords.map((keyword) => {
      const regex = new RegExp(keyword, "i");

      return {
        $or: [
          { name: regex },
          { role: regex },
          { location: regex },
          { experience: regex },
          { keywords: regex },
        ],
      };
    }),
  };
}