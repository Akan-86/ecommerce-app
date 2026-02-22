"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();
  return data.url as string;
}

async function fetchUnsplash(query: string) {
  const res = await fetch(`/api/unsplash?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Unsplash fetch failed");
  return res.json() as Promise<{ urls: string[] }>;
}

type Category = { id: string; name: string; slug: string };

type FormValues = {
  title: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  image: FileList;
  imageUrl: string;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [preview, setPreview] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<string[]>([]);
  const [loadingUnsplash, setLoadingUnsplash] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [paidOrders, setPaidOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [last7DaysRevenue, setLast7DaysRevenue] = useState<
    { date: string; total: number }[]
  >([]);

  const [topProducts, setTopProducts] = useState<
    { productId: string; quantity: number }[]
  >([]);
  const [topProfitProducts, setTopProfitProducts] = useState<
    { productId: string; profit: number }[]
  >([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<
    { month: string; total: number }[]
  >([]);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStripeFees, setTotalStripeFees] = useState(0);
  const [totalNetRevenue, setTotalNetRevenue] = useState(0);

  const [uniqueCustomers, setUniqueCustomers] = useState(0);
  const [returningCustomers, setReturningCustomers] = useState(0);
  const [returningRate, setReturningRate] = useState(0);
  const [topCustomers, setTopCustomers] = useState<
    { userId: string; revenue: number }[]
  >([]);

  const [darkMode, setDarkMode] = useState(false);

  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [displayProfit, setDisplayProfit] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: { imageUrl: "" },
  });

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoadingCats(false);
    }
  };

  const setupOrdersAnalyticsListener = () => {
    const ordersRef = collection(db, "orders");

    return onSnapshot(ordersRef, (snapshot) => {
      let revenue = 0;
      let paid = 0;
      let delivered = 0;
      let cancelled = 0;

      let profit = 0;
      const monthlyMap: Record<string, number> = {};
      let todayCount = 0;
      const todayKey = new Date().toISOString().split("T")[0];

      let stripeFees = 0;
      let netRevenue = 0;

      const customerOrders: Record<string, number> = {};
      const customerRevenue: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.status === "delivered") {
          revenue += data.totalAmount || 0;
          stripeFees += data.stripeFee || 0;
          netRevenue += data.netRevenue || 0;
        }

        if (data.status === "delivered" && data.userId) {
          customerOrders[data.userId] = (customerOrders[data.userId] || 0) + 1;

          customerRevenue[data.userId] =
            (customerRevenue[data.userId] || 0) + (data.netRevenue || 0);
        }

        // Profit (requires cost field per item)
        if (data.status === "delivered" && data.items) {
          data.items.forEach((item: any) => {
            const cost = item.cost || 0;
            const price = item.price || 0;
            const qty = item.quantity || 1;
            profit += (price - cost) * qty;
          });
        }

        // Monthly revenue (net-based)
        if (data.createdAt && data.status === "delivered") {
          const date = new Date(data.createdAt.seconds * 1000);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          monthlyMap[monthKey] =
            (monthlyMap[monthKey] || 0) + (data.netRevenue || 0);
        }

        // Orders today
        if (data.createdAt) {
          const orderDate = new Date(data.createdAt.seconds * 1000)
            .toISOString()
            .split("T")[0];
          if (orderDate === todayKey) todayCount++;
        }

        if (data.status === "paid") paid++;
        if (data.status === "delivered") delivered++;
        if (data.status === "cancelled") cancelled++;
      });

      setTotalRevenue(revenue);
      setTotalOrders(snapshot.size);
      setPaidOrders(paid);
      setDeliveredOrders(delivered);
      setCancelledOrders(cancelled);

      setTotalProfit(profit);
      setTotalStripeFees(stripeFees);
      setTotalNetRevenue(netRevenue);
      setTodayOrders(todayCount);

      const unique = Object.keys(customerOrders).length;
      const returning = Object.values(customerOrders).filter(
        (count) => count > 1
      ).length;

      const rate = unique ? (returning / unique) * 100 : 0;

      const sortedCustomers = Object.entries(customerRevenue)
        .map(([userId, revenue]) => ({ userId, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setUniqueCustomers(unique);
      setReturningCustomers(returning);
      setReturningRate(Number(rate.toFixed(1)));
      setTopCustomers(sortedCustomers);

      const sortedMonths = Object.entries(monthlyMap)
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setMonthlyRevenue(sortedMonths.slice(-6));

      // KPI trend (last 2 months comparison)
      const lastTwo = sortedMonths.slice(-2);
      let revenueTrend = 0;
      if (lastTwo.length === 2 && lastTwo[0].total > 0) {
        revenueTrend =
          ((lastTwo[1].total - lastTwo[0].total) / lastTwo[0].total) * 100;
      }
      (window as any).__revenueTrend = revenueTrend;

      // Last 7 days revenue + product stats
      const today = new Date();
      const days: { date: string; total: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split("T")[0];
        days.push({ date: key, total: 0 });
      }

      const productSales: Record<string, number> = {};
      const productProfit: Record<string, number> = {};

      // (second snapshot.forEach block removed)

      const sorted = Object.entries(productSales)
        .map(([productId, quantity]) => ({ productId, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setTopProducts(sorted);

      const sortedProfit = Object.entries(productProfit)
        .map(([productId, profit]) => ({ productId, profit }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);

      setTopProfitProducts(sortedProfit);
    });
  };

  useEffect(() => {
    let r = 0;
    let p = 0;
    const interval = setInterval(() => {
      r += totalRevenue / 20;
      p += totalProfit / 20;
      if (r >= totalRevenue) r = totalRevenue;
      if (p >= totalProfit) p = totalProfit;
      setDisplayRevenue(Number(r.toFixed(2)));
      setDisplayProfit(Number(p.toFixed(2)));
      if (r === totalRevenue && p === totalProfit) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [totalRevenue, totalProfit]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const unsubscribe = setupOrdersAnalyticsListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const onSubmit = async (data: FormValues) => {
    let thumbnail = data.imageUrl || preview || "";

    const file = data.image?.[0];
    if (file) {
      try {
        thumbnail = await uploadImage(file);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed.");
        return;
      }
    }

    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      cost: Number(data.cost),
      category: data.category,
      stock: Number(data.stock),
      thumbnail,
    };

    const res = await fetch(
      editingId ? `/api/products?id=${editingId}` : "/api/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      reset();
      setPreview("");
      setEditingId(null);
      fetchProducts();
      alert(editingId ? "Product updated!" : "Product added!");
    } else {
      alert("Failed to save product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProducts();
      alert("Product deleted!");
    } else {
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setValue("title", product.title);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("cost", (product as any).cost || 0);
    setValue("category", product.category || "");
    setValue("stock", product.stock || 0);
    setValue("imageUrl", product.thumbnail || "");
    setPreview(product.thumbnail || "");
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
  };

  const handleUnsplashSearch = async () => {
    if (!unsplashQuery.trim()) return;
    setLoadingUnsplash(true);
    try {
      const data = await fetchUnsplash(unsplashQuery);
      setUnsplashResults(data.urls || []);
    } catch (e) {
      console.error(e);
      alert("Unsplash search failed");
    } finally {
      setLoadingUnsplash(false);
    }
  };

  const handleSelectUnsplash = (url: string) => {
    setPreview(url);
    setValue("imageUrl", url);
  };

  const imageUrl = watch("imageUrl");

  const lowStockProducts = products.filter(
    (p) => typeof p.stock === "number" && p.stock <= 5
  );

  const lowMarginProducts = products.filter((p: any) => {
    const cost = p.cost ?? 0;
    const price = p.price ?? 0;
    if (!price) return false;
    const margin = ((price - cost) / price) * 100;
    return margin < 20;
  });

  const totalInventoryCost = products.reduce((acc: number, p: any) => {
    const cost = p.cost ?? 0;
    const stock = p.stock ?? 0;
    return acc + cost * stock;
  }, 0);

  const potentialInventoryRevenue = products.reduce((acc: number, p: any) => {
    const price = p.price ?? 0;
    const stock = p.stock ?? 0;
    return acc + price * stock;
  }, 0);

  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;

  const criticalStockCount = products.filter(
    (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5
  ).length;

  const totalProductsCount = products.length || 1;

  const stockRiskPercent =
    ((criticalStockCount + outOfStockCount) / totalProductsCount) * 100;

  const stockHealthLabel =
    stockRiskPercent < 10
      ? "Healthy"
      : stockRiskPercent < 25
        ? "Warning"
        : "Risky";

  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <div
      className={`max-w-6xl mx-auto px-6 py-10 space-y-10 fade-in ${
        darkMode ? "bg-gray-900 text-white min-h-screen" : ""
      }`}
    >
      <div
        className={`flex justify-between items-center backdrop-blur-md rounded-2xl p-6 shadow-sm border ${darkMode ? "bg-gray-800/70 border-gray-700" : "bg-white/70 border-gray-200"}`}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Financial overview & operational insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">Live Firestore Analytics</div>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="px-4 py-1.5 text-xs rounded-full border border-gray-300 bg-white hover:shadow-sm transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide opacity-80 flex items-center gap-1">
                <DollarSign size={14} /> Total Revenue
              </p>
              <p className="text-2xl font-bold mt-1">
                €{displayRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded">
              {(window as any).__revenueTrend >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {((window as any).__revenueTrend || 0).toFixed(1)}%
            </div>
          </div>
          {last7DaysRevenue.length > 0 && (
            <div className="mt-4">
              <svg viewBox="0 0 100 30" className="w-full h-8">
                {(() => {
                  const max = Math.max(
                    ...last7DaysRevenue.map((d) => d.total),
                    1
                  );
                  const points = last7DaysRevenue
                    .map((d, i) => {
                      const x = (i / (last7DaysRevenue.length - 1)) * 100;
                      const y = 30 - (d.total / max) * 30;
                      return `${x},${y}`;
                    })
                    .join(" ");

                  return (
                    <polyline
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      points={points}
                    />
                  );
                })()}
              </svg>
            </div>
          )}
        </div>
        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{totalOrders}</p>
            </div>
            <ShoppingCart size={18} className="text-gray-400" />
          </div>
        </div>
        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">Paid Orders</p>
          <p className="text-xl font-bold">{paidOrders}</p>
        </div>
        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">Delivered Orders</p>
          <p className="text-xl font-bold">{deliveredOrders}</p>
        </div>
        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">Orders Today</p>
          <p className="text-xl font-bold">{todayOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs uppercase tracking-wide opacity-80">
            📈 Total Profit
          </p>
          <p className="text-2xl font-bold mt-1">€{displayProfit.toFixed(2)}</p>
          {last7DaysRevenue.length > 0 && (
            <div className="mt-4">
              <svg viewBox="0 0 100 30" className="w-full h-8">
                {(() => {
                  const max = Math.max(
                    ...last7DaysRevenue.map((d) => d.total),
                    1
                  );
                  const points = last7DaysRevenue
                    .map((d, i) => {
                      const x = (i / (last7DaysRevenue.length - 1)) * 100;
                      const y = 30 - (d.total / max) * 30;
                      return `${x},${y}`;
                    })
                    .join(" ");

                  return (
                    <polyline
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      points={points}
                    />
                  );
                })()}
              </svg>
            </div>
          )}
        </div>
        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">💸 Stripe Fees</p>
          <p className="text-xl font-bold text-red-600">
            €{totalStripeFees.toFixed(2)}
          </p>
        </div>
        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">🧾 Net Revenue</p>
          <p className="text-xl font-bold text-green-600">
            €{totalNetRevenue.toFixed(2)}
          </p>
        </div>

        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Customers</p>
              <p className="text-xl font-bold">{uniqueCustomers}</p>
            </div>
            <Users size={18} className="text-gray-400" />
          </div>
        </div>

        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">🔁 Returning Customers</p>
          <p className="text-xl font-bold">{returningCustomers}</p>
          <p
            className={`text-xs mt-1 ${returningRate >= 30 ? "text-green-600" : "text-gray-400"}`}
          >
            Rate: {returningRate}%
          </p>
        </div>

        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Cost</p>
              <p className="text-xl font-bold">
                €{totalInventoryCost.toFixed(2)}
              </p>
            </div>
            <Package size={18} className="text-gray-400" />
          </div>
        </div>

        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">💰 Potential Revenue</p>
          <p className="text-xl font-bold">
            €{potentialInventoryRevenue.toFixed(2)}
          </p>
        </div>

        <div
          className={`surface-card p-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <p className="text-sm text-gray-500">🔴 Out of Stock</p>
          <p className="text-xl font-bold text-red-600">{outOfStockCount}</p>
        </div>

        <div className="surface-card p-4">
          <p className="text-sm text-gray-500">📊 Stock Health</p>
          <p className="text-xl font-bold">{stockHealthLabel}</p>
          <p className="text-xs text-gray-400 mt-1">
            Risk: {stockRiskPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      <div
        className={`surface-card p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
      >
        <h2 className="text-lg font-semibold mb-4">Last 7 Days Revenue</h2>
        <div className="flex items-end gap-3 h-40">
          {last7DaysRevenue.map((day) => {
            const max = Math.max(...last7DaysRevenue.map((d) => d.total), 1);
            const height = (day.total / max) * 100;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
                  style={{ height: `${height}%` }}
                ></div>
                <p className="text-xs mt-2">{day.date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div
          className={`surface-card p-6 border border-red-200 bg-red-50/60 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <h2 className="text-lg font-semibold text-red-700 mb-4">
            ⚠ Low Stock Warning
          </h2>
          <ul className="space-y-2">
            {lowStockProducts.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center bg-white p-3 rounded border"
              >
                <span className="font-medium">{product.title}</span>
                <span className="text-red-600 font-bold">
                  Stock: {product.stock}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lowMarginProducts.length > 0 && (
        <div
          className={`surface-card p-6 border border-yellow-200 bg-yellow-50/60 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <h2 className="text-lg font-semibold text-yellow-700 mb-4">
            ⚠ Low Profit Margin (&lt;20%)
          </h2>
          <ul className="space-y-2">
            {lowMarginProducts.map((product: any) => {
              const cost = product.cost ?? 0;
              const price = product.price ?? 0;
              const margin = price
                ? (((price - cost) / price) * 100).toFixed(1)
                : "0";

              return (
                <li
                  key={product.id}
                  className="flex justify-between items-center bg-white p-3 rounded border"
                >
                  <span className="font-medium">{product.title}</span>
                  <span className="text-yellow-700 font-bold">
                    Margin: {margin}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {topProducts.length > 0 && (
        <div
          className={`surface-card p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <h2 className="text-lg font-semibold mb-4">
            🔥 Top Selling Products
          </h2>
          <ul className="space-y-2">
            {topProducts.map((tp) => {
              const product = products.find((p) => p.id === tp.productId);
              return (
                <li
                  key={tp.productId}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span className="font-medium">
                    {product?.title || "Unknown Product"}
                  </span>
                  <span className="text-blue-600 font-bold">
                    Sold: {tp.quantity}
                  </span>
                  {/* UI Only: Refund Action */}
                  <button
                    className="ml-4 px-2 py-1 bg-gray-200 rounded text-xs text-gray-700"
                    title="Refund order (UI only)"
                    disabled
                  >
                    Refund
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {topProfitProducts.length > 0 && (
        <div
          className={`surface-card p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <h2 className="text-lg font-semibold mb-4">
            💰 Most Profitable Products
          </h2>
          <ul className="space-y-2">
            {topProfitProducts.map((tp) => {
              const product = products.find((p) => p.id === tp.productId);
              return (
                <li
                  key={tp.productId}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span className="font-medium">
                    {product?.title || "Unknown Product"}
                  </span>
                  <span className="text-green-600 font-bold">
                    Profit: €{tp.profit.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {topCustomers.length > 0 && (
        <div
          className={`surface-card p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <h2 className="text-lg font-semibold mb-4">
            🏆 Top Customers (by Net Revenue)
          </h2>
          <ul className="space-y-2">
            {topCustomers.map((c) => (
              <li
                key={c.userId}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span className="font-medium truncate">{c.userId}</span>
                <span className="text-purple-600 font-bold">
                  €{c.revenue.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {monthlyRevenue.length > 0 && (
        <div
          className={`surface-card p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <h2 className="text-lg font-semibold mb-4">
            📊 Monthly Revenue (Last 6 Months)
          </h2>
          <div className="flex items-end gap-3 h-40">
            {monthlyRevenue.map((m) => {
              const max = Math.max(...monthlyRevenue.map((d) => d.total), 1);
              const height = (m.total / max) * 100;
              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`w-full rounded-t ${darkMode ? "bg-green-400" : "bg-green-500"}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <p className="text-xs mt-2">{m.month}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={`surface-card p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
      >
        <h1 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-600">{errors.title.message}</p>
          )}

          <textarea
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Price (€)"
              {...register("price", { required: "Price is required", min: 1 })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Cost (€)"
              {...register("cost", { required: "Cost is required", min: 0 })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Stock"
              {...register("stock", { required: "Stock is required", min: 0 })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full border rounded px-3 py-2"
              defaultValue=""
              disabled={loadingCats}
            >
              <option value="" disabled>
                {loadingCats ? "Loading categories..." : "Select category"}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageFile}
              className="block w-full text-sm text-gray-600"
            />

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search Unsplash (e.g. shoes, hoodie...)"
                value={unsplashQuery}
                onChange={(e) => setUnsplashQuery(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={handleUnsplashSearch}
                disabled={loadingUnsplash}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                {loadingUnsplash ? "Searching..." : "Unsplash"}
              </button>
            </div>

            <input
              type="text"
              placeholder="Or paste image URL"
              {...register("imageUrl")}
              onChange={(e) => {
                setValue("imageUrl", e.target.value);
                setPreview(e.target.value);
              }}
              className="w-full border rounded px-3 py-2"
            />

            {(preview || imageUrl) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview</p>
                <img
                  src={preview || imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border"
                />
              </div>
            )}

            {unsplashResults.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {unsplashResults.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Unsplash"
                    onClick={() => handleSelectUnsplash(url)}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:ring-2 ring-blue-500"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Save Product"}
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ul className="divide-y divide-gray-200">
          {products.map((p) => (
            <li key={p.id} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                {p.thumbnail && (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-10 h-10 object-cover rounded border"
                  />
                )}
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const cost = (p as any).cost ?? 0;
                      const price = p.price ?? 0;
                      const margin = price
                        ? (((price - cost) / price) * 100).toFixed(1)
                        : "0";
                      return (
                        <>
                          €{price} | Cost: €{cost} | Margin: {margin}% | Stock:{" "}
                          {p.stock ?? 0}
                        </>
                      );
                    })()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => {
          const rows = [
            ["Product", "Price", "Stock"],
            ...products.map((p) => [p.title, p.price, p.stock ?? 0]),
          ];
          const csvContent = rows.map((r) => r.join(",")).join("\n");
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "products-export.csv";
          a.click();
        }}
        className="mt-8 px-5 py-2.5 rounded-full bg-gray-900 text-white hover:shadow-lg transition"
      >
        Export Products CSV
      </button>
    </div>
  );
}
