import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import dbConnect from "@/src/lib/db";
import ResumeComment from "@/src/models/ResumeComment";

export async function PUT(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Comment message is required" }, { status: 400 });
  }

  const updatedComment = await ResumeComment.findOneAndUpdate(
    {
      _id: params.commentId,
      resumeId: params.id,
      userId: session.user.id,
    },
    { $set: { message } },
    { new: true }
  );

  if (!updatedComment) {
    return NextResponse.json({ error: "Comment not found or access denied" }, { status: 404 });
  }

  return NextResponse.json(updatedComment);
}
