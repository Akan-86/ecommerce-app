import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import type { Product } from "@/lib/types";

// Tek ürün getir (PDP için)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Ürün ID eksik" }, { status: 400 });
    }

    const productRef = doc(db, "products", params.id);
    const snap = await getDoc(productRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const data = snap.data() as Record<string, any>;

    const thumbnail =
      typeof data.thumbnail === "string" && data.thumbnail.trim().length > 0
        ? data.thumbnail
        : undefined;

    const images = Array.isArray(data.images)
      ? data.images.filter(
          (img: any) => typeof img === "string" && img.trim().length > 0
        )
      : [];

    const product: Product = {
      id: snap.id,
      title: String(data.title || "Untitled"),
      description: String(data.description || ""),
      price: Number(data.price || 0),
      currency: data.currency || "USD",
      category: data.category || "uncategorized",
      stock: Number(data.stock || 0),
      thumbnail,
      images,
      image: thumbnail || images[0],
    };

    return NextResponse.json(product);
  } catch (err) {
    console.error("Tek ürün getirme hatası:", err);
    return NextResponse.json({ error: "Ürün getirilemedi" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const { title, description, price, category, stock, thumbnail, currency } =
      data || {};

    if (!title || String(title).length < 3) {
      return NextResponse.json({ error: "Title too short" }, { status: 400 });
    }
    if (!price || Number(price) <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (!params.id) {
      return NextResponse.json({ error: "Ürün ID eksik" }, { status: 400 });
    }

    const productRef = doc(db, "products", params.id);
    await updateDoc(productRef, {
      title: String(title),
      description: String(description || ""),
      price: Number(price),
      currency: currency || "USD",
      category: category || "uncategorized",
      stock: Number(stock || 0),
      thumbnail: thumbnail || "",
      images: thumbnail ? [thumbnail] : [],
      updatedAt: Date.now(),
    });

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
