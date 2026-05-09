export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Skeleton */}
        <div className="rounded-2xl overflow-hidden border border-black/10 bg-white">
          <div className="aspect-square relative overflow-hidden bg-black/10">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-5">
          <div className="h-5 w-28 relative overflow-hidden bg-black/10 rounded">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="h-10 w-3/4 relative overflow-hidden bg-black/10 rounded-xl">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full relative overflow-hidden bg-black/10 rounded">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-4 w-5/6 relative overflow-hidden bg-black/10 rounded">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-4 w-4/6 relative overflow-hidden bg-black/10 rounded">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          <div className="h-8 w-32 relative overflow-hidden bg-black/10 rounded-lg">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="flex gap-4 pt-4">
            <div className="h-11 w-36 relative overflow-hidden bg-black/10 rounded-md">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-11 w-36 relative overflow-hidden bg-black/10 rounded-md">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
