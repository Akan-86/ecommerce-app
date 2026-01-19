"use client";

import { useEffect, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch("/api/admin/products");
        const catRes = await fetch("/api/admin/categories");

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

  if (loading) return <div className="p-6">Loading products…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin · Products</h1>

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
