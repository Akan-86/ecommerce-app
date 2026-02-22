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
  limit,
  startAfter,
  addDoc,
  serverTimestamp,
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
  stripeSessionId?: string;
};

type OrderLog = {
  id: string;
  orderId: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  createdAt: any;
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
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchUserId, setSearchUserId] = useState<string>("");
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderLogs, setOrderLogs] = useState<Record<string, OrderLog[]>>({});

  const allowedTransitions: Record<string, string[]> = {
    paid: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
    refunded: [],
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Order[];

        setOrders(data);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
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

    const allowed = allowedTransitions[currentOrder.status] || [];
    if (!allowed.includes(newStatus)) {
      alert(`Invalid transition: ${currentOrder.status} → ${newStatus}`);
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      await addDoc(collection(db, "orderLogs"), {
        orderId,
        previousStatus: currentOrder.status,
        newStatus,
        changedBy: user?.uid || "admin",
        createdAt: serverTimestamp(),
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRefund = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !order.stripeSessionId) {
      alert("Missing Stripe session ID.");
      return;
    }

    try {
      setRefundingOrderId(orderId);

      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          stripeSessionId: order.stripeSessionId,
        }),
      });

      if (!res.ok) {
        throw new Error("Refund failed");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "refunded" } : o))
      );
    } catch (err) {
      console.error("Refund error:", err);
      alert("Refund failed. Check console.");
    } finally {
      setRefundingOrderId(null);
    }
  };

  const toggleSelect = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedOrders.length === 0) return;

    try {
      await Promise.all(
        selectedOrders.map((orderId) => {
          const orderRef = doc(db, "orders", orderId);
          return updateDoc(orderRef, { status: newStatus });
        })
      );

      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.includes(o.id) ? { ...o, status: newStatus } : o
        )
      );

      setSelectedOrders([]);
    } catch (err) {
      console.error("Bulk update error:", err);
    }
  };

  const exportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = [
      "Order ID",
      "User ID",
      "Status",
      "Total ($)",
      "Created At",
    ];

    const rows = filteredOrders.map((o) => [
      o.id,
      o.userId,
      o.status,
      (o.total / 100).toFixed(2),
      o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadMore = async () => {
    if (!lastDoc) return;

    try {
      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];

      setOrders((prev) => [...prev, ...data]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Pagination error:", err);
    }
  };

  const fetchOrderLogs = async (orderId: string) => {
    try {
      const q = query(
        collection(db, "orderLogs"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const logs = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((log: any) => log.orderId === orderId) as OrderLog[];

      setOrderLogs((prev) => ({ ...prev, [orderId]: logs }));
    } catch (err) {
      console.error("Error fetching logs:", err);
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
      case "refunded":
        return "bg-yellow-100 text-yellow-700";
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
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => bulkUpdateStatus("shipped")}
          disabled={selectedOrders.length === 0}
          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${selectedOrders.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          Mark Selected as Shipped
        </button>
        <button
          onClick={() => bulkUpdateStatus("delivered")}
          disabled={selectedOrders.length === 0}
          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${selectedOrders.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          Mark Selected as Delivered
        </button>
        <button
          onClick={() => bulkUpdateStatus("cancelled")}
          disabled={selectedOrders.length === 0}
          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${selectedOrders.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          Cancel Selected
        </button>
        <button
          onClick={exportCSV}
          className="px-3 py-1 text-sm border rounded bg-green-100 hover:bg-green-200"
        >
          Export CSV
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={
              filteredOrders.length > 0 &&
              selectedOrders.length === filteredOrders.length
            }
            onChange={() => {
              if (selectedOrders.length === filteredOrders.length) {
                setSelectedOrders([]);
              } else {
                setSelectedOrders(filteredOrders.map((o) => o.id));
              }
            }}
          />
          Select All ({filteredOrders.length})
        </label>

        {selectedOrders.length > 0 && (
          <span className="text-sm text-gray-500">
            {selectedOrders.length} selected
          </span>
        )}
      </div>

      <ul className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 border rounded bg-gray-50">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}

        {filteredOrders.map((order) => (
          <li
            key={order.id}
            className="border rounded p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                onChange={() => toggleSelect(order.id)}
                className="mt-1"
              />
              <div className="flex-1">
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
                  {["paid", "shipped", "delivered", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        disabled={
                          order.status === status ||
                          updatingOrderId === order.id ||
                          !(allowedTransitions[order.status] || []).includes(
                            status
                          )
                        }
                        className={`px-2 py-1 text-sm border rounded transition
                        ${
                          order.status === status ||
                          !(allowedTransitions[order.status] || []).includes(
                            status
                          )
                            ? "bg-gray-200 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }
                        ${updatingOrderId === order.id ? "opacity-50 cursor-wait" : ""}`}
                      >
                        {updatingOrderId === order.id && order.status !== status
                          ? "Updating..."
                          : status}
                      </button>
                    )
                  )}
                </div>
                {(order.status === "paid" || order.status === "delivered") && (
                  <button
                    onClick={() => handleRefund(order.id)}
                    disabled={refundingOrderId === order.id}
                    className={`mt-2 px-3 py-1 text-sm rounded border bg-yellow-100 hover:bg-yellow-200 transition
                      ${refundingOrderId === order.id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {refundingOrderId === order.id ? "Refunding..." : "Refund"}
                  </button>
                )}
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

                <button
                  onClick={async () => {
                    if (expandedOrderId === order.id) {
                      setExpandedOrderId(null);
                    } else {
                      setExpandedOrderId(order.id);
                      if (!orderLogs[order.id]) {
                        await fetchOrderLogs(order.id);
                      }
                    }
                  }}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {expandedOrderId === order.id
                    ? "Hide Timeline"
                    : "View Timeline"}
                </button>

                {expandedOrderId === order.id && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm font-semibold mb-2">
                      Status Timeline
                    </p>
                    {orderLogs[order.id]?.length ? (
                      <ul className="space-y-2">
                        {orderLogs[order.id].map((log) => (
                          <li key={log.id} className="text-sm text-gray-600">
                            {log.createdAt?.toDate
                              ? log.createdAt.toDate().toLocaleString()
                              : ""}
                            {" — "}
                            {log.previousStatus} → {log.newStatus}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">No activity yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
