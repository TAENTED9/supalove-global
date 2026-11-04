export default function CartLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen py-8 sm:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-slate-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart items list skeleton */}
          <div className="lg:col-span-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex gap-4 items-center"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/4 bg-slate-200 rounded" />
                  <div className="h-5 w-24 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Order summary card skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-12 w-full bg-slate-200 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
