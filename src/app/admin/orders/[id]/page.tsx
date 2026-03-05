"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIdToken } from "@/lib/firebase";
import { useToast } from "@/context/toast-context";

function getStatusStyles(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case "processing":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "shipped":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    default:
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  }
}

const statuses = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = await getIdToken();

        const res = await fetch(`/api/admin/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        addToast({ type: "error", message: "Failed to load order" });
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  async function updateStatus(newStatus: string) {
    const previousStatus = order.status;

    try {
      setUpdating(true);
      setOrder((prev: any) => ({ ...prev, status: newStatus }));

      const token = await getIdToken();

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      addToast({ type: "success", message: "Order status updated" });
    } catch (err) {
      setOrder((prev: any) => ({ ...prev, status: previousStatus }));
      addToast({ type: "error", message: "Failed to update status" });
    } finally {
      setUpdating(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-white/40 animate-pulse">
        Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center py-24 text-red-400">
        Order not found.
      </div>
    );

  return (
    <div className="space-y-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-white/50 mt-2">
            Full order management and financial breakdown
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`inline-flex items-center rounded-full border px-4 py-2 text-xs capitalize shadow-card transition-all duration-250 ${getStatusStyles(
              order.status
            )}`}
          >
            {order.status}
          </div>

          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className={`px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs transition-all duration-250 focus:outline-none focus:border-brand-400 ${
              updating
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/10 hover:shadow-card"
            }`}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] p-8 shadow-card transition-all duration-250 hover:shadow-elevated">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Customer Email</span>
            <span>{order.customerEmail || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/50">Total</span>
            <span>€{order.total?.toFixed?.(2) || "0.00"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
