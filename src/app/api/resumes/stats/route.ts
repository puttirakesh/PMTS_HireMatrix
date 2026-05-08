import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import dbConnect from "@/src/lib/db";

import Resume from "@/src/models/Resume";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const total =
      await Resume.countDocuments();

    const processed =
      await Resume.countDocuments({
        isProcessed: true,
      });

    const latest =
      await Resume.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return NextResponse.json({
      total,
      processed,
      latest,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}