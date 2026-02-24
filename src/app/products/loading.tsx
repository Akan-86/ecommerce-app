export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      {/* Toolbar Skeleton */}
      <div className="mb-10 bg-white/80 backdrop-blur rounded-2xl px-6 py-4 border border-black/5 shadow-sm">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 border border-black/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] space-y-6">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-gray-200 animate-pulse" />

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-9 flex-1 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-9 flex-1 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
