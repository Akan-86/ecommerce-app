"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type OrderItem = {
  name: string;
  quantity: number;
  amount: number;
};

type Order = {
  id: string;
  total: number;
  items: OrderItem[];
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold text-red-600">
          Access denied. Admins only.
        </h1>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  // Calculate metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const totalOrders = orders.length;

  // Aggregate product sales
  const productSales: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales[item.name] =
        (productSales[item.name] ?? 0) + (item.quantity ?? 0);
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border rounded p-4 shadow-sm bg-white text-center">
          <h2 className="text-lg font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold text-green-600">
            ${(totalSales / 100).toFixed(2)}
          </p>
        </div>
        <div className="border rounded p-4 shadow-sm bg-white text-center">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="border rounded p-4 shadow-sm bg-white text-center">
          <h2 className="text-lg font-semibold">Top Products</h2>
          <ul className="text-sm mt-2">
            {topProducts.map(([name, qty]) => (
              <li key={name}>
                {name} — {qty} sold
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
