"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();
  return data.url as string;
}

async function fetchUnsplash(query: string) {
  const res = await fetch(`/api/unsplash?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Unsplash fetch failed");
  return res.json() as Promise<{ urls: string[] }>;
}

type Category = { id: string; name: string; slug: string };

type FormValues = {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: FileList;
  imageUrl: string;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [preview, setPreview] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<string[]>([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: { imageUrl: "" },
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormValues) => {
    let thumbnail = data.imageUrl || preview || "";

    const file = data.image?.[0];
    if (file) {
      try {
        thumbnail = await uploadImage(file);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed.");
        return;
      }
    }

    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      stock: Number(data.stock),
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
      setPreview("");
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
    setValue("imageUrl", product.thumbnail || "");
    setPreview(product.thumbnail || "");
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
  };

  const handleUnsplashSearch = async () => {
    if (!unsplashQuery.trim()) return;
    setLoadingUnsplash(true);
    try {
      const data = await fetchUnsplash(unsplashQuery);
      setUnsplashResults(data.urls || []);
    } catch (e) {
      console.error(e);
      alert("Unsplash search failed");
    } finally {
      setLoadingUnsplash(false);
    }
  };

  const handleSelectUnsplash = (url: string) => {
    setPreview(url);
    setValue("imageUrl", url);
  };

  const imageUrl = watch("imageUrl");

  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

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

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Price (€)"
            {...register("price", { required: "Price is required", min: 1 })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            {...register("stock", { required: "Stock is required", min: 0 })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full border rounded px-3 py-2"
            defaultValue=""
            disabled={loadingCats}
          >
            <option value="" disabled>
              {loadingCats ? "Loading categories..." : "Select category"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Upload image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImageFile}
            className="block w-full text-sm text-gray-600"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search Unsplash (e.g. shoes, hoodie...)"
              value={unsplashQuery}
              onChange={(e) => setUnsplashQuery(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={handleUnsplashSearch}
              disabled={loadingUnsplash}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
            >
              {loadingUnsplash ? "Searching..." : "Unsplash"}
            </button>
          </div>

          <input
            type="text"
            placeholder="Or paste image URL"
            {...register("imageUrl")}
            onChange={(e) => {
              setValue("imageUrl", e.target.value);
              setPreview(e.target.value);
            }}
            className="w-full border rounded px-3 py-2"
          />

          {(preview || imageUrl) && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Image Preview</p>
              <img
                src={preview || imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded border"
              />
            </div>
          )}

          {unsplashResults.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {unsplashResults.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Unsplash"
                  onClick={() => handleSelectUnsplash(url)}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:ring-2 ring-blue-500"
                />
              ))}
            </div>
          )}
        </div>

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

      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <ul className="divide-y divide-gray-200">
        {products.map((p) => (
          <li key={p.id} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-3">
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-10 h-10 object-cover rounded border"
                />
              )}
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-gray-600">
                  €{p.price} | Stock: {p.stock ?? 0}
                </p>
              </div>
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
