import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase-admin";

const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

function methodNotAllowed() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

async function verifyAdmin(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = authorization.split("Bearer ")[1];
  const decodedToken = await auth.verifyIdToken(token);

  if (!decodedToken.admin) {
    throw { status: 403, message: "Forbidden" };
  }

  return decodedToken;
}

export async function GET(request: Request) {
  try {
    await verifyAdmin(request);
    const snapshot = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(products);
  } catch (err: any) {
    if (err?.status) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    }

    console.error("Admin products API error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await verifyAdmin(req);
    const body = await req.json();
    const docRef = await db.collection("products").add({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (err: any) {
    if (err?.status) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    }

    console.error("Admin products API error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE(req: Request) {
  try {
    await verifyAdmin(req);
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    await db.collection("products").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.status) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    }

    console.error("Admin products API error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
