import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    if (!params.id) {
      return NextResponse.json({ error: "Ürün ID eksik" }, { status: 400 });
    }

    const productRef = doc(db, "products", params.id);
    await updateDoc(productRef, data);

    return NextResponse.json({ success: true, message: "Ürün güncellendi" });
  } catch (err) {
    console.error("Ürün güncelleme hatası:", err);
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}

// Ürün silme
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Ürün ID eksik" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const imagePath = searchParams.get("imagePath"); // storage path

    // Firestore'dan ürünü sil
    await deleteDoc(doc(db, "products", params.id));

    // Storage'dan görseli sil (varsa)
    if (imagePath) {
      const storageRef = ref(storage, imagePath);
      await deleteObject(storageRef);
    }

    return NextResponse.json({ success: true, message: "Ürün silindi" });
  } catch (err) {
    console.error("Ürün silme hatası:", err);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}
