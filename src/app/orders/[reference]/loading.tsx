export default function OrderDetailsLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen py-8 sm:py-12 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-28 bg-slate-200 rounded-full" />
          </div>

          {/* Timeline skeleton */}
          <div className="h-16 w-full bg-slate-100 rounded-xl" />

          {/* Order items skeleton */}
          <div className="space-y-3 pt-4">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
