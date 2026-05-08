import { NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";

import dbConnect from "@/src/lib/db";

import Resume from "@/src/models/Resume";

// =========================
// GET ALL RESUMES
// =========================

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

    const page = Number(searchParams.get("page")) || 1;

    const limit = Number(searchParams.get("limit")) || 20;

    const skip = (page - 1) * limit;

    const resumes = await Resume.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Resume.countDocuments();

    return NextResponse.json({
      resumes,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE RESUME
// =========================

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();

    const user = await currentUser();

    const userName =
      user?.fullName ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "Unknown User";

    const resume = await Resume.create({
      ...body,
      userId,
      userName,
    });

    return NextResponse.json(resume, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}