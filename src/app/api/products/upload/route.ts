import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const blob = await put(file.name, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
