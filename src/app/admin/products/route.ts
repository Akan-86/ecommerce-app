import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const db = getFirestore(adminApp);

function methodNotAllowed() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function GET() {
  try {
    const snapshot = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET products error:", err);
    return NextResponse.json(
      { message: "Products could not be loaded" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const docRef = await db.collection("products").add({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (err) {
    console.error("POST product error:", err);
    return NextResponse.json(
      { message: "Product could not be created" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    await db.collection("products").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE product error:", err);
    return NextResponse.json(
      { message: "Product could not be deleted" },
      { status: 500 }
    );
  }
}
