import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const categoryRef = doc(db, "categories", params.id);
    await updateDoc(categoryRef, { name });
    return NextResponse.json({ id: params.id, name });
  } catch (err) {
    console.error("Error updating category:", err);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryRef = doc(db, "categories", params.id);
    await deleteDoc(categoryRef);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting category:", err);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
