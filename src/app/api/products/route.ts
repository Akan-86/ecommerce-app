import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;

    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
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
    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 }
      );
    }
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }
    if (image.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be < 2MB." },
        { status: 400 }
      );
    }

    const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
    const bytes = await image.arrayBuffer();
    await uploadBytes(storageRef, new Uint8Array(bytes));
    const imageUrl = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, "products"), {
      title,
      price,
      category,
      imageUrl,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      id: docRef.id,
      title,
      price,
      category,
      imageUrl,
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

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const image = formData.get("image") as File | null;

    const productRef = doc(db, "products", id);

    let updateData: any = { title, price, category };

    if (image && image instanceof File) {
      const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
      const bytes = await image.arrayBuffer();
      await uploadBytes(storageRef, new Uint8Array(bytes));
      const imageUrl = await getDownloadURL(storageRef);
      updateData.imageUrl = imageUrl;
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
