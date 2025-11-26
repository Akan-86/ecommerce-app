import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await req.json();
    const userRef = doc(db, "users", params.id);

    await updateDoc(userRef, { role });

    return NextResponse.json({ success: true, message: "Role updated" });
  } catch (err) {
    console.error("Error updating role:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update role" },
      { status: 500 }
    );
  }
}
