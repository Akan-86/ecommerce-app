import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const productRef = doc(db, "products", params.id);
  await updateDoc(productRef, data);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const imagePath = searchParams.get("imagePath"); // storage path

  await deleteDoc(doc(db, "products", params.id));

  if (imagePath) {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  }

  return NextResponse.json({ success: true });
}
