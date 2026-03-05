"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      if (!id || !user) return;

      try {
        const snap = await getDoc(doc(db, "orders", id as string));

        if (!snap.exists()) {
          router.push("/orders");
          return;
        }

        const data = snap.data();

        // Security check – user can only see their own orders
        if (data.userId !== user.uid) {
          router.push("/orders");
          return;
        }

        setOrder({ id: snap.id, ...data });
      } finally {
        setFetching(false);
      }
    };

    fetchOrder();
  }, [id, user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center animate-pulse">
          <span className="text-xl">⏳</span>
        </div>
        <p className="text-gray-500 text-base">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  const createdAt = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleString()
    : "—";

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-10">
        Order Details
      </h1>

      <div className="border border-black/5 rounded-3xl p-10 bg-white shadow-[0_25px_70px_-25px_rgba(0,0,0,0.2)] space-y-8">
        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-500">Order ID</span>
          <span className="text-sm font-medium text-gray-900">{order.id}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-500">Status</span>
          <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium capitalize text-yellow-700">
            {order.status}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-500">Created</span>
          <span className="text-sm">{createdAt}</span>
        </div>

        <div className="border-t border-black/5" />

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
            Items
          </h2>
          <ul className="space-y-4 divide-y divide-black/5">
            {order.items?.map((item: any, idx: number) => (
              <li
                key={idx}
                className="flex justify-between text-sm text-gray-700 pt-4 first:pt-0"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${((item.amount ?? 0) / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-black/5" />

        <div className="flex justify-between text-xl font-semibold text-gray-900 pt-4">
          <span>Total</span>
          <span>${(order.total ?? 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
