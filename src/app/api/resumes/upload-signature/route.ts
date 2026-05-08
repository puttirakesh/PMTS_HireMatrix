import { NextResponse } from "next/server";
import { generateSignature, type CloudinarySignatureParams } from "@/src/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { folder?: unknown };
    const paramsToSign: CloudinarySignatureParams = {};
    const folder = typeof body.folder === "string" ? body.folder : undefined;
    if (folder) {
      paramsToSign.folder = folder;
    }

    const { timestamp, signature } = await generateSignature(paramsToSign);
    return NextResponse.json({ timestamp, signature });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create upload signature";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
