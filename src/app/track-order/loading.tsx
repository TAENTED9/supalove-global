export default function TrackOrderLoading() {
  return (
    <div className="bg-slate-50/50 min-h-screen py-12 animate-pulse">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
          <div className="h-6 w-44 bg-slate-200 rounded mx-auto" />
          <div className="h-4 w-64 bg-slate-200 rounded mx-auto" />
          <div className="h-11 w-full bg-slate-100 rounded-xl mt-4" />
          <div className="h-11 w-full bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
