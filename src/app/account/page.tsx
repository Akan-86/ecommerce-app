"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <span aria-live="polite">Loading account…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <button
          onClick={async () => {
            await logout();
            clearCart();
            router.push("/");
          }}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Log out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Profile</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="text-gray-500">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-gray-500">User ID:</span> {user.uid}
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/account/settings"
              className="text-sm font-medium text-black hover:underline"
            >
              Edit profile →
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Orders</h2>
          <div className="rounded border p-4 text-sm text-gray-600">
            <p>You have no orders yet.</p>
            <p className="mt-2">
              <Link
                href="/products"
                className="font-medium text-black hover:underline"
              >
                Start shopping →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
