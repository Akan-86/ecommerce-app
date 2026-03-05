export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Skeleton */}
        <div className="rounded-3xl overflow-hidden border border-gray-200/80 bg-white shadow-sm">
          <div className="aspect-square bg-gray-200 animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />

          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />

          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />

          <div className="flex gap-4 pt-4">
            <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
