"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  categoryId: string;
  imageUrl: string;
};

type Category = {
  id: string;
  name: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(title.trim() && price && categoryId && imageUrl);
  }, [title, price, categoryId, imageUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);

        if (!prodRes.ok) throw new Error("Failed to fetch products");
        if (!catRes.ok) throw new Error("Failed to fetch categories");

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(prodData);
        setCategories(catData);
      } catch (e) {
        console.error(e);
        setError("Data could not be loaded");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          price: Number(price),
          categoryId,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      setTitle("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
    } catch (e) {
      console.error(e);
      setError("Product could not be created");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading products…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin · Products</h1>

      {/* Create Form */}
      <div className="rounded border p-4 space-y-4">
        <h2 className="font-medium">Add New Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded border px-3 py-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="rounded border px-3 py-2"
            placeholder="Price (€)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="rounded border px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            className="rounded border px-3 py-2"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {imageUrl && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Image preview:</p>
            <img
              src={imageUrl}
              alt="Preview"
              className="h-40 w-40 object-cover rounded border"
            />
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={!canSubmit || submitting}
          className="inline-flex items-center rounded bg-black px-4 py-2 text-white disabled:opacity-40"
        >
          {submitting ? "Saving…" : "Add Product"}
        </button>
      </div>

      {/* List */}
      {products.length === 0 ? (
        <div className="border border-dashed p-6 text-center text-gray-500">
          No products yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded p-3">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-40 w-full object-cover mb-2 rounded"
                />
              )}
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">€{p.price}</p>
              <p className="text-xs text-gray-500">
                {categories.find((c) => c.id === p.categoryId)?.name || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
