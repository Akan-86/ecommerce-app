"use client";

import { useEffect, useMemo, useState } from "react";
import { getIdToken } from "@/lib/firebase";
import { useToast } from "@/context/toast-context";

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
  const { addToast } = useToast();

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
        const token = await getIdToken();

        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
      const token = await getIdToken();

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      addToast({ type: "success", message: "Product created" });
    } catch (e) {
      console.error(e);
      setError("Product could not be created");
      addToast({ type: "error", message: "Product could not be created" });
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

  const handleDelete = async (id: string) => {
    const previous = products;

    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));

      const token = await getIdToken();

      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      addToast({ type: "success", message: "Product deleted" });
    } catch (e) {
      setProducts(previous);
      addToast({ type: "error", message: "Failed to delete product" });
    }
  };

  if (loading) return <div className="p-6">Loading products…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        Products Management
      </h1>

      {/* Create Form */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-8 space-y-6 shadow-[0_0_40px_-15px_rgba(0,0,0,0.6)]">
        <h2 className="font-medium">Add New Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Price (€)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
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
              className={`px-4 py-1.5 rounded-lg text-xs border transition ${activeTab === "upload" ? "bg-white text-black border-white" : "border-white/10 text-white/60 hover:bg-white/5"}`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("unsplash")}
              className={`px-4 py-1.5 rounded-lg text-xs border transition ${activeTab === "unsplash" ? "bg-white text-black border-white" : "border-white/10 text-white/60 hover:bg-white/5"}`}
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
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
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
                  className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-40 transition hover:opacity-90"
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
          className="inline-flex items-center rounded-lg bg-white text-black px-5 py-2 text-sm font-medium disabled:opacity-40 transition hover:opacity-90"
        >
          {submitting ? "Saving…" : "Add Product"}
        </button>
      </div>

      {/* List */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">📦</div>
            <div className="text-sm">No products yet</div>
            <div className="text-xs text-white/30">
              Create your first product to get started
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-[#111318] p-4 space-y-2 hover:shadow-[0_0_30px_-10px_rgba(0,0,0,0.6)] transition"
            >
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-40 w-full object-cover mb-2 rounded"
                />
              )}
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-white/70 font-medium">
                €{Number(p.price).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {categories.find((c) => c.id === p.categoryId)?.name || "—"}
              </p>
              <button
                onClick={() => handleDelete(p.id)}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
