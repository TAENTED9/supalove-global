import Link from 'next/link'
import { Metadata } from 'next'
import { ChevronRight, PackageSearch, RotateCcw } from 'lucide-react'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductCatalogHeader } from '@/components/products/ProductCatalogHeader'
import { ProductCard } from '@/components/products/ProductCard'
import { Pagination } from '@/components/products/Pagination'
import { getCategories, getProducts } from '@/lib/data'

interface ProductsPageProps {
  searchParams: {
    category?: string
    unit?: string
    inStock?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const category = searchParams.category
  const search = searchParams.search
  const unit = searchParams.unit

  let title = 'All Products & Foodstuffs | Supalovefoods'
  if (category) {
    title = `${category.replace('-', ' ').toUpperCase()} Foodstuffs | Supalovefoods`
  } else if (search) {
    title = `Search results for "${search}" | Supalovefoods`
  } else if (unit) {
    title = `Shop by Unit (${unit}) | Supalovefoods`
  }

  return {
    title,
    description: 'Explore verified Nigerian foodstuffs, 50kg grain bags, pure palm oils, legumes, and agricultural commodities ready for retail and international export.',
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined

  const [categories, { products, total, totalPages, currentPage }] = await Promise.all([
    getCategories(),
    getProducts({
      category: searchParams.category,
      unit: searchParams.unit,
      inStock: searchParams.inStock === 'true',
      search: searchParams.search,
      minPrice,
      maxPrice,
      sort: searchParams.sort,
      page,
      limit: 12,
    }),
  ])

  return (
    <div className="bg-slate-50/40 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href="/products" className="text-slate-800 font-bold">
            Products Catalog
          </Link>
          {searchParams.category && (
            <>
              <ChevronRight size={13} />
              <span className="text-brand-green font-bold capitalize">
                {searchParams.category.replace('-', ' ')}
              </span>
            </>
          )}
          {searchParams.unit && (
            <>
              <ChevronRight size={13} />
              <span className="text-brand-orange font-bold uppercase">
                {searchParams.unit}
              </span>
            </>
          )}
        </nav>

        {/* Page Title & Tagline */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {searchParams.category
              ? searchParams.category.replace('-', ' ').toUpperCase()
              : searchParams.unit
              ? `PRODUCE SOLD BY ${searchParams.unit}`
              : 'All Foodstuffs & Commodities'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Machine cleaned, 100% stone-free, and carefully packaged. Direct farm pricing with transparent weight options.
          </p>
        </div>

        {/* Two-Column Layout: Sidebar Filters + Main Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <ProductFilters categories={categories} />

          {/* Main Catalog View */}
          <div className="flex-1 w-full">
            {/* Header with Sort and Filter Chips */}
            <ProductCatalogHeader totalCount={total} />

            {/* Products Grid or Empty State */}
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center my-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <PackageSearch size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  No commodities found matching your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Try clearing some filters, searching with broader keywords, or exploring another category.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-brand-green/20"
                >
                  <RotateCcw size={14} /> Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  )
}
