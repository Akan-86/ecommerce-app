"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

type OrderItem = {
  name: string;
  quantity: number;
  amount: number;
};

type Order = {
  id: string;
  userId: string;
  total: number;
  createdAt: any;
  status: string;
  items: OrderItem[];
  shippingAddress?: string;
  trackingNumber?: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
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

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Orders</h1>
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
            <p>User: {order.userId}</p>
            <p>
              Status: <span className="font-medium">{order.status}</span>
            </p>
            <div className="flex gap-2 my-2">
              {["paid", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order.id, status)}
                  className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  {status}
                </button>
              ))}
            </div>
            <ul className="mb-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  {item.name} × {item.quantity} — $
                  {(item.amount / 100).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="font-bold">
              Total: ${(order.total / 100).toFixed(2)}
            </p>
            <p className="text-sm text-gray-700">
              Shipping Address: {order.shippingAddress ?? "Not provided"}
            </p>
            <p className="text-sm text-gray-700">
              Tracking Number: {order.trackingNumber ?? "Not available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
