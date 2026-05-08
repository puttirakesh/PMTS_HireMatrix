import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/src/lib/db";
import ResumeComment from "@/src/models/ResumeComment";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, commentId } = await params;
  await dbConnect();

  const deletedComment = await ResumeComment.findOneAndDelete({
    _id: commentId,
    resumeId: id,
    userId,
  });

  if (!deletedComment) {
    return NextResponse.json({ error: "Comment not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ message: "Comment deleted" });
}
