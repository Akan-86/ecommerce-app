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

type UnsplashPhoto = {
  id: string;
  alt?: string | null;
  thumb?: string;
  small?: string;
  regular?: string;
  full?: string;
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

  // Image picker state
  const [activeTab, setActiveTab] = useState<"upload" | "unsplash">("upload");
  const [uploading, setUploading] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashResults, setUnsplashResults] = useState<UnsplashPhoto[]>([]);

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
      setUnsplashQuery("");
      setUnsplashResults([]);
    } catch (e) {
      console.error(e);
      setError("Product could not be created");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (!data?.url) throw new Error("No URL returned");
      setImageUrl(data.url);
      setActiveTab("upload");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const searchUnsplash = async () => {
    if (!unsplashQuery.trim()) return;
    setUnsplashLoading(true);
    try {
      const res = await fetch(
        `/api/unsplash?q=${encodeURIComponent(unsplashQuery)}`
      );
      if (!res.ok) throw new Error("Unsplash search failed");
      const data = await res.json();
      const results = data?.results || [];
      console.log("Unsplash results:", results);
      setUnsplashResults(results);
    } catch (e) {
      console.error(e);
      alert("Unsplash search failed");
      setUnsplashResults([]);
    } finally {
      setUnsplashLoading(false);
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
        </div>

        {/* Image Picker */}
        <div className="mt-4 space-y-3">
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1 rounded border ${activeTab === "upload" ? "bg-black text-white" : ""}`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("unsplash")}
              className={`px-3 py-1 rounded border ${activeTab === "unsplash" ? "bg-black text-white" : ""}`}
            >
              Unsplash
            </button>
          </div>

          {activeTab === "upload" && (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleUploadFile(e.target.files[0])
                }
              />
              {uploading && <p className="text-xs text-gray-500">Uploading…</p>}
            </div>
          )}

          {activeTab === "unsplash" && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="Search photos (e.g. sneakers, chair, laptop)"
                  value={unsplashQuery}
                  onChange={(e) => setUnsplashQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchUnsplash();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={searchUnsplash}
                  disabled={unsplashLoading || !unsplashQuery.trim()}
                  className="rounded bg-black px-3 py-2 text-white disabled:opacity-40"
                >
                  {unsplashLoading ? "Searching…" : "Search"}
                </button>
              </div>

              {unsplashLoading && (
                <p className="text-xs text-gray-500">Searching Unsplash…</p>
              )}

              {!unsplashLoading &&
                unsplashResults.length === 0 &&
                unsplashQuery.trim() && (
                  <p className="text-xs text-gray-500">No results found.</p>
                )}

              {unsplashResults.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {unsplashResults
                    .filter((p) => p && (p.small || p.thumb || p.regular))
                    .map((p) => {
                      const url = p.small || p.thumb || p.regular || "";
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            if (!url) return;
                            setImageUrl(url);
                            setActiveTab("unsplash");
                          }}
                          className={`relative rounded overflow-hidden border ${imageUrl === url ? "ring-2 ring-black" : ""}`}
                        >
                          <img
                            src={url || "/placeholder.png"}
                            alt={p.alt || "Unsplash photo"}
                            className="h-24 w-full object-cover"
                          />
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Image preview:</p>
            <img
              src={imageUrl}
              alt={title || "Preview"}
              loading="lazy"
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
