import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ref = doc(db, "coupons", params.id);
    const snap = await getDoc(ref);
    if (!snap.exists())
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ id: snap.id, ...(snap.data() as any) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const ref = doc(db, "coupons", params.id);
    const updatePayload: any = { ...body, updatedAt: Date.now() };

    if (updatePayload.value !== undefined)
      updatePayload.value = Number(updatePayload.value);
    if (updatePayload.usageLimit !== undefined)
      updatePayload.usageLimit = Number(updatePayload.usageLimit);
    await updateDoc(ref, updatePayload);
    const snap = await getDoc(ref);
    return NextResponse.json({ id: snap.id, ...(snap.data() as any) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDoc(doc(db, "coupons", params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
