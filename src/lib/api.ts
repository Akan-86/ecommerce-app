import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import type { Product } from "./types";

// Firebase config is loaded from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function fetchProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const ref = doc(db, "products", String(id));
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Product not found");
  return { id: snap.id, ...snap.data() } as Product;
}

export async function fetchRelatedProducts(
  category: string,
  currentProductId: string,
  max: number = 4
): Promise<Product[]> {
  const productsRef = collection(db, "products");
  const q = query(
    productsRef,
    where("category", "==", category),
    limit(max + 2)
  );

  const snapshot = await getDocs(q);

  const products = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
    .filter((p) => p.id !== currentProductId)
    .slice(0, max);

  return products;
}
