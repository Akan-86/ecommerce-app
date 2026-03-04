"use client";

import { useEffect, useMemo, useState } from "react";
import { getIdToken } from "@/lib/firebase";
import { useToast } from "@/context/toast-context";

type Category = {
  id: string;
  name: string;
  slug: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const slugPreview = useMemo(() => slugify(name), [name]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getIdToken();

        const res = await fetch("/api/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Categories could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = async () => {
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = await getIdToken();

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setName("");
      addToast({ type: "success", message: "Category created" });
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: "Category could not be created" });
      setError("Category could not be created.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this category?");
    if (!ok) return;

    const previous = categories;

    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));

      const token = await getIdToken();

      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete category");

      addToast({ type: "success", message: "Category deleted" });
    } catch (err) {
      setCategories(previous);
      addToast({ type: "error", message: "Category could not be deleted" });
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading categories…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        Categories Management
      </h1>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-8 space-y-4 shadow-[0_0_40px_-15px_rgba(0,0,0,0.6)]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={handleAddCategory}
            disabled={submitting || !name.trim()}
            className="rounded-lg bg-white text-black px-5 py-2 text-sm font-medium disabled:opacity-40 transition hover:opacity-90"
          >
            {submitting ? "Adding…" : "Add"}
          </button>
        </div>

        {name && (
          <p className="text-xs text-gray-500">
            Slug preview: <span className="font-mono">{slugPreview}</span>
          </p>
        )}
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">🏷️</div>
            <div className="text-sm">No categories yet</div>
            <div className="text-xs text-white/30">
              Create your first category above
            </div>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111318] px-5 py-4 hover:shadow-[0_0_30px_-10px_rgba(0,0,0,0.6)] transition"
            >
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.slug}</p>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-1.5 text-sm text-red-400 hover:bg-red-500/30 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
