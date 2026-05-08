import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/src/lib/db";
import Resume from "@/src/models/Resume";
import ResumeComment from "@/src/models/ResumeComment";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();
  const resume = await Resume.findById(id).lean();
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const comments = await ResumeComment.find({ resumeId: id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();
  const resume = await Resume.findById(id).lean();
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const body = await req.json();
  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Comment message is required" }, { status: 400 });
  }

  const user = await currentUser();
  const userName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Unknown user";

  const comment = await ResumeComment.create({
    resumeId: id,
    userId: userId,
    userName,
    message,
  });

  return NextResponse.json(comment, { status: 201 });
}
