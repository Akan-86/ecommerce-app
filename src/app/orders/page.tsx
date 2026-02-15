"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

type OrderItem = {
  name: string;
  quantity: number;
  amount: number;
};

type Order = {
  id: string;
  total: number;
  createdAt?: { toDate?: () => Date } | null; // Firestore timestamp (safe)
  status: string;
  items: OrderItem[];
  shippingAddress?: string;
  trackingNumber?: string;
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
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
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <span aria-live="polite">Loading your orders…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // redirected
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">No orders yet</h1>
        <p className="text-gray-600 mb-4">
          Start shopping and your orders will appear here.
        </p>
        <a
          href="/products"
          className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Browse products →
        </a>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "delivered":
        return "text-purple-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="block border rounded-2xl p-4 shadow-sm bg-white transition hover:shadow-md hover:border-gray-400"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Order ID: {order.id}</span>
                <span className="text-sm text-gray-500">
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : ""}
                </span>
              </div>
              <p className="mb-2">
                Status:{" "}
                <span className={`font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </p>
              <p className="mb-2 text-sm text-gray-700">
                Shipping Address: {order.shippingAddress ?? "Not provided"}
              </p>
              <p className="mb-2 text-sm text-gray-700">
                Tracking Number: {order.trackingNumber ?? "Not available"}
              </p>
              <p className="font-bold">
                Total: ${(order.total / 100).toFixed(2)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
