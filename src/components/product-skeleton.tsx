export default function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* Image */}
      <div className="aspect-square w-full rounded-xl bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-4 w-1/2 rounded bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>

        <div className="h-5 w-1/3 rounded bg-gray-300 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>

        <div className="h-10 w-full rounded-xl bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </div>
  );
}

/* Add this globally in your CSS (globals.css):

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.6) 50%,
    rgba(255,255,255,0) 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

*/
