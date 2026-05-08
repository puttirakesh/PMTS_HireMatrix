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

    const tags =
      await Resume.distinct("keywords");

    return NextResponse.json(tags);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}