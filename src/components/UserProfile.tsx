"use client";

import { useAuth } from "@/context/auth-context";
import Spinner from "@/components/Spinner";

export default function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">Not logged in 🔒</p>
      </div>
    );
  }

  return (
    <div className="border p-6 rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2">👤 Profile</h2>
      <p>
        <strong>Name:</strong> {user.displayName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>User ID:</strong> {user.uid}
      </p>
    </div>
  );
}
