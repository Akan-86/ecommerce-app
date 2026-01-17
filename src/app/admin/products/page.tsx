"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
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
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    category: "",
    imageUrl: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<
    { id: string; thumb: string; full: string; alt: string }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const handleSearchUnsplash = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const res = await fetch(
        `/api/unsplash?q=${encodeURIComponent(searchQuery)}&per_page=12`
      );
      if (!res.ok) throw new Error("Unsplash search failed");
      const data = await res.json();
      setUnsplashResults(data.results || []);
    } catch (e) {
      console.error(e);
      alert("Unsplash search failed");
    } finally {
      setSearching(false);
    }
  };

  const uploadImageToBlob = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  };

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatEUR = (v: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(v);

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const url = `/api/admin/products/${id}?imagePath=${encodeURIComponent(imageUrl)}`;
    await fetch(url, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    alert("Product deleted successfully");
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/admin/products", {
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
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
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
            min={0}
            step={0.01}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
            className="border p-2 rounded"
          />
          {/* Category Dropdown */}
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="col-span-full">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadImageToBlob(file);
                  setNewProduct({ ...newProduct, imageUrl: url });
                } catch (err) {
                  alert("Image upload failed");
                }
              }}
              className="mb-2 block"
            />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Search Unsplash (e.g. shoes, watch, laptop)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={handleSearchUnsplash}
                disabled={searching}
                className="px-4 py-2 bg-black text-white rounded disabled:opacity-40"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {unsplashResults.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-2">
                {unsplashResults.map((img) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() =>
                      setNewProduct({ ...newProduct, imageUrl: img.full })
                    }
                    className="border rounded overflow-hidden hover:ring-2 hover:ring-black"
                  >
                    <img
                      src={img.thumb}
                      alt={img.alt}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Or paste image URL"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            {newProduct.imageUrl && (
              <img
                src={newProduct.imageUrl}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded border"
              />
            )}
          </div>
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
              <p className="text-gray-500">{formatEUR(product.price)}</p>
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
              min={0}
              step={0.01}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            {/* Category Dropdown */}
            <select
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadImageToBlob(file);
                    setEditingProduct({ ...editingProduct, imageUrl: url });
                  } catch (err) {
                    alert("Image upload failed");
                  }
                }}
                className="mb-2 block"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Search Unsplash"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <button
                  type="button"
                  onClick={handleSearchUnsplash}
                  disabled={searching}
                  className="px-3 py-2 bg-black text-white rounded disabled:opacity-40"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>

              {unsplashResults.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {unsplashResults.map((img) => (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() =>
                        setEditingProduct({
                          ...editingProduct,
                          imageUrl: img.full,
                        })
                      }
                      className="border rounded overflow-hidden hover:ring-2 hover:ring-black"
                    >
                      <img
                        src={img.thumb}
                        alt={img.alt}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

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

              {editingProduct.imageUrl && (
                <img
                  src={editingProduct.imageUrl}
                  alt="Preview"
                  className="h-24 object-cover rounded border"
                />
              )}
            </div>
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
