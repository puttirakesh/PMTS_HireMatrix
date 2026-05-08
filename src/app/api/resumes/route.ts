import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import dbConnect from "@/src/lib/db";
import Resume from "@/src/models/Resume";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const resumes = await Resume.find({})
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(resumes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const body = await req.json();
  const { name, role, phone, email, location, experience, keywords, fileUrl, public_id, fileType } = body;
  if (!name || !role || !fileUrl || !public_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const resume = await Resume.create({
    userId: session.user.id,
    name,
    role,
    phone: phone || "",
    email: email || "",
    location: location || "",
    experience: experience || "",
    keywords: keywords || [],
    fileUrl,
    public_id,
    fileType: fileType || "",
    isProcessed: false,
  });
  return NextResponse.json(resume, { status: 201 });
}