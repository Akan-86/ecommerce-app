"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/lib/types";
import { uploadImageToStorage } from "@/lib/upload"; // ✅ görsel yükleme fonksiyonu

type FormValues = {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: FileList;
};

export default function AdminPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>();

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data: FormValues) => {
    const file = data.image?.[0];
    let thumbnail = "";

    if (file) {
      try {
        thumbnail = await uploadImageToStorage(file); // ✅ görseli yükle ve URL al
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed.");
        return;
      }
    }

    const payload = {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      stock: data.stock,
      thumbnail,
    };

    const res = await fetch(
      editingId ? `/api/products?id=${editingId}` : "/api/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      reset();
      setPreview(null);
      setEditingId(null);
      fetchProducts();
      alert(editingId ? "Product updated!" : "Product added!");
    } else {
      alert("Failed to save product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProducts();
      alert("Product deleted!");
    } else {
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setValue("title", product.title);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("category", product.category || "");
    setValue("stock", product.stock || 0);
    setPreview(product.thumbnail || null);
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}

        <textarea
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.description && (
          <p className="text-red-600">{errors.description.message}</p>
        )}

        <input
          type="number"
          placeholder="Price"
          {...register("price", { required: "Price is required", min: 1 })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.price && <p className="text-red-600">{errors.price.message}</p>}

        <input
          type="text"
          placeholder="Category"
          {...register("category", { required: "Category is required" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.category && (
          <p className="text-red-600">{errors.category.message}</p>
        )}

        <input
          type="number"
          placeholder="Stock"
          {...register("stock", { required: "Stock is required", min: 0 })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.stock && <p className="text-red-600">{errors.stock.message}</p>}

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImagePreview}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : editingId
              ? "Update Product"
              : "Save Product"}
        </button>
      </form>

      {/*Product List */}
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <ul className="divide-y divide-gray-200">
        {products.map((p) => (
          <li key={p.id} className="flex justify-between items-center py-2">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-600">
                ${p.price} | Stock: {p.stock ?? 0}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
