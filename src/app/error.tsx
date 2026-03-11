"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Something went wrong
        </h1>

        <p className="text-gray-600">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            Try again
          </button>

          <a
            href="/"
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
