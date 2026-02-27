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
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
          No orders yet
        </h1>
        <p className="text-gray-600 text-base mb-6">
          Start shopping and your orders will appear here.
        </p>
        <a
          href="/products"
          className="inline-flex items-center rounded-2xl border border-black/10 px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
        >
          Browse products →
        </a>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-600 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "delivered":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-10">
        My Orders
      </h1>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="block border border-black/5 rounded-3xl p-6 bg-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.25)] hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-semibold text-gray-900">
                  Order ID: {order.id}
                </span>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : ""}
                </span>
              </div>
              <div className="mb-4">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusStyles(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="mb-1 text-sm text-gray-700">
                Shipping Address: {order.shippingAddress ?? "Not provided"}
              </p>
              <p className="mb-4 text-sm text-gray-700">
                Tracking Number: {order.trackingNumber ?? "Not available"}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                Total: ${(order.total / 100).toFixed(2)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
