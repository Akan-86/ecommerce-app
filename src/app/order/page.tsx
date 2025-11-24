"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

type OrderItem = {
  name: string;
  quantity: number;
  amount: number;
};

type Order = {
  id: string;
  total: number;
  createdAt: any; // Firestore timestamp
  status: string;
  items: OrderItem[];
  shippingAddress?: string;
  trackingNumber?: string;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
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

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">
          Please log in to view your orders.
        </h1>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">No orders found.</h1>
        <p className="text-gray-600">
          Start shopping and your orders will appear here.
        </p>
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
          <li key={order.id} className="border rounded p-4 shadow-sm bg-white">
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
            <button
              onClick={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
              className="text-blue-600 text-sm underline mb-2"
            >
              {expandedOrder === order.id ? "Hide details" : "View details"}
            </button>
            {expandedOrder === order.id && (
              <ul className="mb-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item.name} × {item.quantity} — $
                    {(item.amount / 100).toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            <p className="font-bold">
              Total: ${(order.total / 100).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
