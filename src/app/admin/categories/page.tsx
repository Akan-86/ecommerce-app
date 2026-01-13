"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Fetch categories error:", error);
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
    } catch (error) {
      console.error("Add category error:", error);
      alert("Category could not be created");
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
    } catch (error) {
      console.error("Delete category error:", error);
      alert("Category could not be deleted");
    }
  };

  if (loading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin · Categories</h1>

      {/* Create */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleAddCategory}
          disabled={submitting}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between border rounded px-3 py-2"
            >
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.slug}</p>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-sm text-red-600 hover:underline"
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
