"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const url = `/api/products/${id}?imagePath=${encodeURIComponent(imageUrl)}`;

    await fetch(url, { method: "DELETE" });

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (id: string) => {
    alert(`Edit functionality for product ${id} will be implemented`);
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded shadow-sm p-4 flex flex-col"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-500">${product.price}</p>
              <p className="text-sm text-gray-400">{product.category}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.imageUrl)}
                  className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
