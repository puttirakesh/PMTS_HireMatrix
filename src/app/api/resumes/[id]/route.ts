import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import dbConnect from "@/src/lib/db";

import Resume from "@/src/models/Resume";

import cloudinary from "@/src/lib/cloudinary";

// =========================
// GET SINGLE RESUME
// =========================

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const resume =
      await Resume.findById(id).lean();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE RESUME
// =========================

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const existingResume = await Resume.findById(id);

    if (!existingResume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // ONLY OWNER CAN EDIT
    if (existingResume.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // DELETE OLD FILE IF NEW FILE UPLOADED
    if (
      body.public_id &&
      body.public_id !== existingResume.public_id
    ) {
      try {
        await cloudinary.uploader.destroy(
          existingResume.public_id,
          {
            resource_type: "raw",
          }
        );
      } catch (err) {
        console.error("Cloudinary delete failed", err);
      }
    }

    const updatedResume =
      await Resume.findByIdAndUpdate(
        id,
        {
          ...body,

          // force fresh URL
          fileUrl: body.fileUrl
            ? `${body.fileUrl}?updated=${Date.now()}`
            : existingResume.fileUrl,

          updatedAt: new Date(),
        },
        {
          new: true,
        }
      );

    return NextResponse.json(updatedResume);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE RESUME
// =========================

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const resume =
      await Resume.findOne({
        _id: id,
        userId,
      });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // CLOUDINARY DELETE
    if (resume.public_id) {
      await cloudinary.uploader.destroy(
        resume.public_id,
        {
          resource_type: "raw",
        }
      );
    }

    await Resume.deleteOne({
      _id: id,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}