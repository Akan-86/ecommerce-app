"use client";

import { useEffect, useMemo, useState } from "react";

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

  const slugPreview = useMemo(() => slugify(name), [name]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
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
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Category could not be created.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this category?");
    if (!ok) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Category could not be deleted");
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading categories…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin · Categories</h1>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create */}
      <div className="mb-8 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded border px-3 py-2"
          />
          <button
            onClick={handleAddCategory}
            disabled={submitting || !name.trim()}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-40"
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
        <div className="rounded border border-dashed p-6 text-center text-sm text-gray-500">
          No categories yet. Add your first category above.
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded border px-4 py-3"
            >
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.slug}</p>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 active:scale-95 transition"
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
