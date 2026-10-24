export default function ProductsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-8 w-64 bg-slate-200 rounded mb-3" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>

        {/* Filter Strip Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex flex-wrap gap-3">
          <div className="h-9 w-40 bg-slate-200 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
          <div className="h-9 w-48 bg-slate-200 rounded-xl ml-auto" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden p-4 space-y-3"
            >
              <div className="aspect-square w-full bg-slate-200 rounded-xl" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="h-6 w-24 bg-slate-200 rounded" />
                <div className="h-8 w-16 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
