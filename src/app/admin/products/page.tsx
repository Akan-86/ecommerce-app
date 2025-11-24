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
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    category: "",
    imageUrl: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const url = `/api/products/${id}?imagePath=${encodeURIComponent(imageUrl)}`;
    await fetch(url, { method: "DELETE" });

    setProducts((prev) => prev.filter((p) => p.id !== id));
    alert("Product deleted successfully");
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      setNewProduct({ title: "", price: 0, category: "", imageUrl: "" });
      alert("Product added successfully");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingProduct(null);
      alert("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* Add Product Form */}
      <div className="mb-8 border p-4 rounded shadow-sm bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded shadow-sm p-4 flex flex-col bg-white"
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
                  onClick={() => handleEdit(product)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.imageUrl)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <input
              type="text"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, title: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={editingProduct.imageUrl}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  imageUrl: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
