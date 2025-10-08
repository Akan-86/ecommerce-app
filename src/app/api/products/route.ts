import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function GET() {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const category = formData.get("category") as string;
  const image = formData.get("image") as File;

  // Upload image to Firebase Storage
  const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
  const bytes = await image.arrayBuffer();
  await uploadBytes(storageRef, new Uint8Array(bytes));
  const imageUrl = await getDownloadURL(storageRef);

  // Save product in Firestore
  const docRef = await addDoc(collection(db, "products"), {
    title,
    price,
    category,
    imageUrl,
    createdAt: Date.now(),
  });

  return NextResponse.json({ id: docRef.id, title, price, category, imageUrl });
}
