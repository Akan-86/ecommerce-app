import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

/**
 * Firestore instance (admin)
 */
const db = getFirestore(adminApp);

/**
 * GET /admin/categories
 */
export async function GET() {
  try {
    const snapshot = await db
      .collection("categories")
      .orderBy("name", "asc")
      .get();

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json(
      { message: "Categories could not be fetched" },
      { status: 500 }
    );
  }
}

/**
 * POST /admin/categories
 */
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const ref = await db.collection("categories").add({
      name,
      slug,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: ref.id, name, slug }, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json(
      { message: "Category could not be created" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /admin/categories?id=xxx
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Category id is required" },
        { status: 400 }
      );
    }

    await db.collection("categories").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { message: "Category could not be deleted" },
      { status: 500 }
    );
  }
}
