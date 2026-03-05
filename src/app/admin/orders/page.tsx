"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { useToast } from "@/context/toast-context";
import EmptyState from "@/components/ui/empty-state";
import { Receipt } from "lucide-react";

interface Order {
  id: string;
  customerEmail?: string;
  status: string;
  total?: number;
  createdAt?: string | null;
}

const STATUS_OPTIONS = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

function getStatusStyles(status: string) {
  switch (status) {
    case "paid":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "processing":
      return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
    case "shipped":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "delivered":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case "cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "refunded":
      return "bg-pink-500/15 text-pink-400 border-pink-500/30";
    default:
      return "bg-white/10 text-white/60 border-white/20";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const { showToast } = useToast();

  async function fetchOrders(reset = false) {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const query = new URLSearchParams({
        limit: "10",
      });

      if (!reset && cursor) {
        query.append("cursor", cursor);
      }

      const res = await fetch(`/api/admin/orders?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setOrders(data.orders);
      setNextCursor(data.nextCursor);
      setTotalCount(data.totalCount);
      setLoading(false);
    } catch (err) {
      showToast("Failed to load orders", "error");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const filteredOrders = useMemo(() => {
    const base = orders
      .filter((o) => (filter === "all" ? true : o.status === filter))
      .filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          (o.customerEmail || "").toLowerCase().includes(search.toLowerCase())
      );

    const sorted = [...base].sort((a, b) => {
      if (sortField === "total") {
        const aVal = a.total || 0;
        const bVal = b.total || 0;
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    });

    return sorted;
  }, [orders, search, filter, sortField, sortDirection]);

  async function updateStatus(id: string, newStatus: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      showToast("Authentication required", "error");
      return;
    }

    const previous = orders.find((o) => o.id === id)?.status;

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    try {
      const token = await user.getIdToken();

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      showToast("Order status updated", "success");
    } catch {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: previous || o.status } : o
        )
      );

      showToast("Failed to update order", "error");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <div className="text-xs text-white/50 mt-1">
            {filteredOrders.length} / {totalCount} orders
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs transition-all duration-250 hover:border-brand-400"
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </select>

          <button
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs transition-all duration-250 hover:border-brand-400"
          >
            {sortDirection === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by ID or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm w-64 transition-all duration-250 focus:border-brand-400 focus:outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm transition-all duration-250 hover:border-brand-400 focus:border-brand-400 focus:outline-none"
        >
          <option value="all">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] overflow-hidden shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-[#151821] text-white/60 uppercase text-xs sticky top-0 z-10 backdrop-blur border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Order</th>
              <th className="text-left px-6 py-4">Customer</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Total</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-right px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-20">
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16">
                  <EmptyState
                    icon={<Receipt size={26} />}
                    title="No matching orders"
                    description="We couldn’t find any orders matching your current filters or search criteria. Try adjusting them to see results."
                    primaryAction={
                      <button
                        onClick={() => {
                          setSearch("");
                          setFilter("all");
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-semibold btn-primary transition-all duration-250 active:scale-[0.97]"
                      >
                        Clear Filters
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() =>
                    (window.location.href = `/admin/orders/${order.id}`)
                  }
                  className="border-t border-white/5 hover:bg-white/5 hover:shadow-card transition-all duration-250 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {order.customerEmail || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`rounded-full border px-3 py-1 text-xs capitalize bg-transparent transition-all duration-250 hover:shadow-card focus:outline-none ${getStatusStyles(order.status)}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    €{order.total?.toFixed?.(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 text-white/50">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-white/60 hover:text-white transition-colors duration-250"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setCursor(null);
            fetchOrders(true);
          }}
          disabled={loading}
          className="px-4 py-2 text-xs rounded-lg border border-white/10 bg-white/5 disabled:opacity-40 transition-all duration-250 hover:border-brand-400 hover:shadow-card"
        >
          Reset
        </button>

        <button
          onClick={() => {
            if (nextCursor) {
              setCursor(nextCursor);
              fetchOrders();
            }
          }}
          disabled={!nextCursor || loading}
          className="px-4 py-2 text-xs rounded-lg border border-white/10 bg-white/5 disabled:opacity-40 transition-all duration-250 hover:border-brand-400 hover:shadow-card"
        >
          Next
        </button>
      </div>
    </div>
  );
}
