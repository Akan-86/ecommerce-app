export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      {/* Toolbar Skeleton */}
      <div className="mb-10">
        <div className="h-4 w-32 bg-black/10 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="rounded-2xl p-6 border border-black/10 space-y-4">
            <div className="h-5 w-40 relative overflow-hidden bg-black/10 rounded">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-10 relative overflow-hidden bg-black/10 rounded-xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-10 relative overflow-hidden bg-black/10 rounded-xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-10 relative overflow-hidden bg-black/10 rounded-xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/10 bg-white overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="aspect-square relative overflow-hidden bg-black/10">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 relative overflow-hidden bg-black/10 rounded">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-4 w-1/2 relative overflow-hidden bg-black/10 rounded">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-5 w-1/3 relative overflow-hidden bg-black/10 rounded">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-9 flex-1 relative overflow-hidden bg-black/10 rounded-md">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                  <div className="h-9 flex-1 relative overflow-hidden bg-black/10 rounded-md">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
