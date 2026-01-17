import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content-type. Use multipart/form-data." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "products";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: JPEG, PNG, WEBP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^\w.\-]+/g, "_").toLowerCase();
    const filename = `${Date.now()}-${safeName}`;
    const path = `uploads/${folder}/${filename}`;

    const blob = await put(path, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json(
      {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: file.size,
        name: safeName,
        folder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
