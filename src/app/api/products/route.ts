import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function GET() {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price, category, stock, thumbnail } = body;

    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }
    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters." },
        { status: 400 }
      );
    }
    if (!price || isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0." },
        { status: 400 }
      );
    }
    if (!category) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }
    if (isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a valid number >= 0." },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "products"), {
      title,
      description,
      price,
      category,
      stock,
      thumbnail: thumbnail || "",
      images: thumbnail ? [thumbnail] : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({
      id: docRef.id,
      title,
      description,
      price,
      category,
      stock,
      thumbnail,
      images: thumbnail ? [thumbnail] : [],
    });
  } catch (err) {
    console.error("Product creation error:", err);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );

    const body = await req.json();
    const { title, description, price, category, stock, thumbnail } = body;

    const productRef = doc(db, "products", id);

    const updateData: any = {
      title,
      description,
      price,
      category,
      stock,
      updatedAt: Date.now(),
    };

    if (thumbnail) {
      updateData.thumbnail = thumbnail;
      updateData.images = [thumbnail];
    }

    await updateDoc(productRef, updateData);

    return NextResponse.json({ id, ...updateData });
  } catch (err) {
    console.error("Product update error:", err);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );

    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
