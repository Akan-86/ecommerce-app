// NOTE: Add this to globals.css if not present:
// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-1/3 bg-gray-200 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.5s_infinite] rounded-lg" />
          <div className="h-5 w-1/2 bg-gray-200 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.5s_infinite] rounded-lg" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-4 space-y-4 bg-white"
            >
              <div className="aspect-square bg-gray-200 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.5s_infinite] rounded-xl" />
              <div className="h-4 bg-gray-200 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.5s_infinite] rounded w-3/4" />
              <div className="h-4 bg-gray-200 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.5s_infinite] rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
