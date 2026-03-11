export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg" />
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 p-4 space-y-4"
            >
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
