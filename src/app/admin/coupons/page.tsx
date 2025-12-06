"use client";

import { useEffect, useState } from "react";
import type { Coupon } from "@/types/coupon";

const emptyForm = {
  code: "",
  type: "percent" as "percent" | "fixed",
  value: 0,
  scopes: { products: [] as string[], categories: [] as string[] },
  startAt: undefined as number | undefined,
  endAt: undefined as number | undefined,
  minOrderTotal: 0,
  usageLimit: undefined as number | undefined,
  active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/coupons");
        if (!res.ok) throw new Error("Failed to load coupons");
        const data = await res.json();
        setCoupons(data);
      } catch (err: any) {
        console.error(err);
        setError("Could not load coupons");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  };

  const handleCreateOrUpdate = async () => {
    setSaving(true);
    setError(null);
    try {
      // Basic validation
      if (!form.code || !form.type || Number(form.value) <= 0) {
        setError("Please provide code, type and a positive value.");
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        code: String(form.code).trim().toUpperCase(),
        value: Number(form.value),
        minOrderTotal: form.minOrderTotal
          ? Number(form.minOrderTotal)
          : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        startAt: form.startAt
          ? Number(new Date(form.startAt).getTime())
          : undefined,
        endAt: form.endAt ? Number(new Date(form.endAt).getTime()) : undefined,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/coupons/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Save failed");
      }

      const saved = await res.json();
      setCoupons((prev) => {
        if (editingId) return prev.map((c) => (c.id === saved.id ? saved : c));
        return [...prev, saved];
      });

      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: Coupon) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      scopes: c.scopes || { products: [], categories: [] },
      startAt: c.startAt
        ? new Date(c.startAt).toISOString().slice(0, 16)
        : undefined,
      endAt: c.endAt ? new Date(c.endAt).toISOString().slice(0, 16) : undefined,
      minOrderTotal: c.minOrderTotal ?? 0,
      usageLimit: c.usageLimit ?? undefined,
      active: c.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCoupons((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>

      {/* Form */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Coupon" : "Create Coupon"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Code (e.g. SUMMER10)"
            value={form.code || ""}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="percent">Percent</option>
            <option value="fixed">Fixed amount</option>
          </select>

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Value (percent or fixed amount)"
            value={form.value ?? 0}
            onChange={(e) =>
              setForm({ ...form, value: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Min order total (optional)"
            value={form.minOrderTotal ?? 0}
            onChange={(e) =>
              setForm({ ...form, minOrderTotal: Number(e.target.value) })
            }
          />

          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={form.startAt ?? ""}
            onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          />

          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={form.endAt ?? ""}
            onChange={(e) => setForm({ ...form, endAt: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Usage limit (optional)"
            value={form.usageLimit ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                usageLimit: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <span>Active</span>
          </label>

          {/* Simple scopes input (comma separated) */}
          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Product IDs (comma separated, optional)"
            value={(form.scopes?.products || []).join(",")}
            onChange={(e) =>
              setForm({
                ...form,
                scopes: {
                  ...(form.scopes || {}),
                  products: e.target.value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                },
              })
            }
          />
          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Categories (comma separated, optional)"
            value={(form.scopes?.categories || []).join(",")}
            onChange={(e) =>
              setForm({
                ...form,
                scopes: {
                  ...(form.scopes || {}),
                  categories: e.target.value
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                },
              })
            }
          />
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleCreateOrUpdate}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Coupon"
                : "Create Coupon"}
          </button>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* List */}
      <div className="border rounded p-4 bg-white">
        <h2 className="text-lg font-semibold mb-3">Existing Coupons</h2>

        {loading ? (
          <p>Loading...</p>
        ) : coupons.length === 0 ? (
          <p>No coupons found.</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border p-3 rounded"
              >
                <div>
                  <div className="font-semibold">
                    {c.code}{" "}
                    <span className="text-sm text-gray-500">({c.type})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Value:{" "}
                    {c.type === "percent" ? `${c.value}%` : `$${c.value}`} •
                    Active: {c.active ? "Yes" : "No"}
                  </div>
                  <div className="text-xs text-gray-400">
                    Min: ${c.minOrderTotal ?? 0} • Used: {c.usageCount ?? 0}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
