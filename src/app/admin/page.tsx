"use client";

import { useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !category || !image) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("image", image);

    await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    setTitle("");
    setPrice("");
    setCategory("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
