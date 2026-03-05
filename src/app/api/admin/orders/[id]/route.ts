import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebaseAdmin";

const allowedStatuses = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

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

// ✅ GET single order (secure admin access)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdmin(request);

    const doc = await db.collection("orders").doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data = doc.data();

    const items = Array.isArray(data?.items) ? data.items : [];

    const subtotal = typeof data?.subtotal === "number" ? data.subtotal : null;
    const shipping = typeof data?.shipping === "number" ? data.shipping : null;
    const tax = typeof data?.tax === "number" ? data.tax : null;
    const total = typeof data?.total === "number" ? data.total : null;

    return NextResponse.json({
      id: doc.id,
      ...data,
      items,
      subtotal,
      shipping,
      tax,
      total,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
    });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Admin order GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ PATCH update order status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const decodedToken = await verifyAdmin(request);

    const body = await request.json();
    const status = body?.status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const orderRef = db.collection("orders").doc(params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await orderRef.update({
      status,
      updatedAt: new Date(),
      updatedBy: decodedToken.uid,
    });

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Admin order PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
