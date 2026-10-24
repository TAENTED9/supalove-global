export default function ProductDetailLoading() {
  return (
    <div className="bg-slate-50/40 min-h-screen py-6 animate-pulse">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link Skeleton */}
        <div className="h-4 w-28 bg-slate-200 rounded mb-4" />

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="aspect-square w-full rounded-2xl bg-slate-200" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg bg-slate-200 shrink-0" />
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 p-5 space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-5/6 bg-slate-200 rounded" />
                <div className="h-3 w-4/6 bg-slate-200 rounded" />
              </div>
            </div>

            {/* Right Column (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="h-7 w-4/5 bg-slate-200 rounded" />
                <div className="h-10 w-32 bg-slate-200 rounded" />

                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                    <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                    <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                  </div>
                </div>

                <div className="h-10 w-full bg-slate-200 rounded-lg" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
