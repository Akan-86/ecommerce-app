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
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

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
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, authLoading, isAdmin, router]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchUserId, setSearchUserId] = useState<string>("");
  const [searchOrderId, setSearchOrderId] = useState<string>("");

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
    const currentOrder = orders.find((o) => o.id === orderId);
    if (!currentOrder || currentOrder.status === newStatus) return;

    try {
      setUpdatingOrderId(orderId);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (authLoading || loading || !user || !isAdmin)
    return <div className="p-6 text-center">Loading orders...</div>;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    const matchesUser = searchUserId
      ? order.userId.toLowerCase().includes(searchUserId.toLowerCase())
      : true;

    const matchesOrder = searchOrderId
      ? order.id.toLowerCase().includes(searchOrderId.toLowerCase())
      : true;

    return matchesStatus && matchesUser && matchesOrder;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Orders</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search by User ID"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <ul className="space-y-4">
        {filteredOrders.map((order) => (
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
              Status:
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </p>
            <div className="flex gap-2 my-2">
              {["paid", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order.id, status)}
                  disabled={
                    order.status === status || updatingOrderId === order.id
                  }
                  className={`px-2 py-1 text-sm border rounded transition
                    ${order.status === status ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}
                    ${updatingOrderId === order.id ? "opacity-50 cursor-wait" : ""}`}
                >
                  {updatingOrderId === order.id && order.status !== status
                    ? "Updating..."
                    : status}
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
