"use client";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 animate-pulse">
      {/* HERO SKELETON */}
      <div className="mb-16 space-y-6">
        <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 rounded-full" />
        <div className="h-6 w-96 bg-gray-200 dark:bg-white/10 rounded-full" />
        <div className="flex gap-4 pt-4">
          <div className="h-10 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
        </div>
      </div>

      {/* GRID SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-gray-200 dark:bg-white/10 rounded-2xl" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="h-10 w-full bg-gray-200 dark:bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
