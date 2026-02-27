import Link from "next/link";
import { db } from "@/lib/firebaseAdmin";

async function getOrders() {
  const snapshot = await db
    .collection("orders")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : null,
    };
  });
}

export default async function AdminOrdersPage() {
  const orders: any[] = await getOrders();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-white/50 mt-2">
          Manage and track all customer orders
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111318] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60 uppercase text-xs tracking-wide">
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4 font-medium text-white">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-white/70">
                  {order.customerEmail || "-"}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs capitalize">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  ${order.total?.toFixed?.(2) || "0.00"}
                </td>
                <td className="px-6 py-4 text-white/50">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-white/60 hover:text-white transition"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-white/40"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
