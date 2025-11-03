"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

type Order = {
  id: string;
  date: string;
  total: number;
  items: { title: string; quantity: number }[];
};

export default function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders?userId=${userId}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No orders found 📦</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded shadow-sm">
          <p className="font-semibold">Order #{order.id}</p>
          <p className="text-sm text-gray-500">Date: {order.date}</p>
          <p className="text-sm text-gray-500">Total: ${order.total}</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.title} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
