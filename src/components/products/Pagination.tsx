'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1
        const isActive = pageNum === currentPage
        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => goToPage(pageNum)}
            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
export default Pagination
