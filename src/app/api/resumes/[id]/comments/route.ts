import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import dbConnect from "@/src/lib/db";
import Resume from "@/src/models/Resume";
import ResumeComment from "@/src/models/ResumeComment";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const resume = await Resume.findById(params.id).lean();
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const comments = await ResumeComment.find({ resumeId: params.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const resume = await Resume.findById(params.id).lean();
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const body = await req.json();
  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Comment message is required" }, { status: 400 });
  }

  const email = session.user.email || "unknown";
  const userName = email.split("@")[0] || "user";

  const comment = await ResumeComment.create({
    resumeId: params.id,
    userId: session.user.id,
    userName,
    message,
  });

  return NextResponse.json(comment, { status: 201 });
}
