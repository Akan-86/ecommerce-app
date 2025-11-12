"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type ProductFormProps = {
  product?: {
    id?: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  };
  onSuccess?: () => void;
};

export default function AdminProductForm({
  product,
  onSuccess,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState(product?.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = image;

      if (file) {
        const storageRef = ref(storage, `products/${file.name}-${Date.now()}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (product?.id) {
        // update existing product
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, {
          name,
          price,
          description,
          image: imageUrl,
          updatedAt: serverTimestamp(),
        });
      } else {
        // new product Addition
        await addDoc(collection(db, "products"), {
          name,
          price,
          description,
          image: imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      alert("✅ Product saved successfully");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("❌ An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-6 rounded shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-2">
        {product ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
      </h2>

      <div>
        <label className="block text-sm font-medium">Ürün Adı</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Fiyat (USD)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Görsel URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Opsiyonel: URL gir veya dosya yükle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Görsel Dosya</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving" : "Save Product"}
      </button>
    </form>
  );
}
