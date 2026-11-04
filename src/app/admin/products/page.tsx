'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Loader2,
  Check,
  Upload,
  RefreshCw,
  Star,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EMPTY_PRODUCT_SPECS, type ProductSpecs } from '@/lib/product-specs'

interface VariantFormItem {
  id?: string
  label: string
  unit: 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE'
  priceInNaira: number
  compareAtPriceInNaira?: number
  stock: number
  minOrderQty: number
  sku: string
}

interface ProductRecord {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category: { id: string; name: string }
  images: string[]
  isActive: boolean
  isFeatured: boolean
  specifications?: ProductSpecs
  variants: {
    id: string
    label: string
    unit: 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE'
    price: number // in kobo
    compareAtPrice?: number | null
    stock: number
    minOrderQty: number
    sku: string
  }[]
}

interface CategoryOption {
  id: string
  name: string
}

interface ProductFormDraft {
  name: string
  slug: string
  description: string
  categoryId: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  specifications: ProductSpecs
  variants: VariantFormItem[]
}

const PRODUCT_DRAFT_KEY = 'supalovefoods-admin-product-draft'

function isProductFormDraft(value: unknown): value is ProductFormDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  return (
    typeof draft.name === 'string' &&
    typeof draft.slug === 'string' &&
    typeof draft.description === 'string' &&
    typeof draft.categoryId === 'string' &&
    Array.isArray(draft.images) &&
    draft.images.every((image) => typeof image === 'string') &&
    typeof draft.isActive === 'boolean' &&
    typeof draft.isFeatured === 'boolean' &&
    (draft.specifications === undefined ||
      (typeof draft.specifications === 'object' &&
        draft.specifications !== null &&
        ['origin', 'packaging', 'shelfLife', 'storage'].every(
          (field) => typeof (draft.specifications as Record<string, unknown>)[field] === 'string'
        ))) &&
    Array.isArray(draft.variants) &&
    draft.variants.every((variant) => {
      if (!variant || typeof variant !== 'object') return false
      const item = variant as Record<string, unknown>
      return (
        (item.id === undefined || typeof item.id === 'string') &&
        typeof item.label === 'string' &&
        ['BAG', 'KG', 'LITRE', 'CARTON', 'PIECE'].includes(String(item.unit)) &&
        typeof item.priceInNaira === 'number' &&
        (item.compareAtPriceInNaira === undefined || typeof item.compareAtPriceInNaira === 'number') &&
        typeof item.stock === 'number' &&
        typeof item.minOrderQty === 'number' &&
        typeof item.sku === 'string'
      )
    })
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null)
  const [productToDelete, setProductToDelete] = useState<ProductRecord | null>(null)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [draftState, setDraftState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [specifications, setSpecifications] = useState<ProductSpecs>(EMPTY_PRODUCT_SPECS)
  const [variants, setVariants] = useState<VariantFormItem[]>([
    { label: '50kg Bag', unit: 'BAG', priceInNaira: 52000, stock: 50, minOrderQty: 1, sku: 'RICE-50KG' },
  ])

  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ])
      const pData = await pRes.json()
      const cData = await cRes.json()

      if (!pRes.ok || !pData.success) {
        throw new Error(pData.error || 'Failed to load products')
      }
      if (!cRes.ok || !cData.success) {
        throw new Error(cData.error || 'Failed to load categories')
      }
      setProducts(pData.products)
      setCategories(cData.categories)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load products or categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!modalOpen || editingProduct) return

    const timeout = window.setTimeout(() => {
      try {
        const draft: ProductFormDraft = {
          name,
          slug,
          description,
          categoryId,
          images,
          isActive,
          isFeatured,
          specifications,
          variants,
        }
        window.localStorage.setItem(PRODUCT_DRAFT_KEY, JSON.stringify(draft))
        setDraftState('saved')
      } catch (error) {
        console.error('Unable to save product draft:', error)
        setDraftState('error')
      }
    }, 600)

    setDraftState('saving')
    return () => window.clearTimeout(timeout)
  }, [modalOpen, editingProduct, name, slug, description, categoryId, images, isActive, isFeatured, specifications, variants])

  const openCreateModal = () => {
    setEditingProduct(null)
    setName('')
    setSlug('')
    setDescription('')
    setCategoryId(categories[0]?.id || '')
    setImages([])
    setIsActive(true)
    setIsFeatured(false)
    setSpecifications(EMPTY_PRODUCT_SPECS)
    setVariants([
      { label: 'Standard Pack', unit: 'KG', priceInNaira: 5000, stock: 100, minOrderQty: 1, sku: `PROD-${Date.now().toString().slice(-4)}` },
    ])
    setDraftState('idle')
    try {
      const savedDraft = window.localStorage.getItem(PRODUCT_DRAFT_KEY)
      if (savedDraft) {
        const parsed: unknown = JSON.parse(savedDraft)
        if (isProductFormDraft(parsed)) {
          setName(parsed.name)
          setSlug(parsed.slug)
          setDescription(parsed.description)
          setCategoryId(parsed.categoryId)
          setImages(parsed.images)
          setIsActive(parsed.isActive)
          setIsFeatured(parsed.isFeatured)
          setSpecifications(parsed.specifications ?? EMPTY_PRODUCT_SPECS)
          setVariants(parsed.variants)
          setDraftState('saved')
        } else {
          toast.warning('The saved product draft is invalid; a fresh draft will be started.')
          setDraftState('error')
        }
      }
    } catch (error) {
      console.error('Unable to restore product draft:', error)
      toast.error('The saved product draft could not be opened.')
      setDraftState('error')
    }
    setModalOpen(true)
  }

  const openEditModal = (p: ProductRecord) => {
    setEditingProduct(p)
    setName(p.name)
    setSlug(p.slug)
    setDescription(p.description)
    setCategoryId(p.categoryId)
    setImages(p.images || [])
    setIsActive(p.isActive)
    setIsFeatured(p.isFeatured)
    setSpecifications(p.specifications ?? EMPTY_PRODUCT_SPECS)
    setVariants(
      p.variants.map((v) => ({
        id: v.id,
        label: v.label,
        unit: v.unit,
        priceInNaira: v.price / 100,
        compareAtPriceInNaira: v.compareAtPrice ? v.compareAtPrice / 100 : undefined,
        stock: v.stock,
        minOrderQty: v.minOrderQty || 1,
        sku: v.sku,
      }))
    )
    setModalOpen(true)
  }

  // Handle client-side file upload with sharp optimization API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setImages((prev) => [...prev, data.url])
      toast.success('Image compressed and uploaded successfully!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error uploading image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        label: 'New Size/Unit',
        unit: 'KG',
        priceInNaira: 1000,
        stock: 50,
        minOrderQty: 1,
        sku: `SKU-${Date.now().toString().slice(-4)}`,
      },
    ])
  }

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) {
      toast.warning('A product must have at least one variant size/unit')
      return
    }
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariantChange = (
    index: number,
    field: keyof VariantFormItem,
    value: unknown
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !categoryId) {
      toast.error('Please fill in product name, description, and category')
      return
    }

    if (variants.length === 0) {
      toast.error('At least one variant size/price is required')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name,
        slug: slug.trim() || undefined,
        description,
        categoryId,
        images,
        isActive,
        isFeatured,
        specifications,
        variants: variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit,
          price: Math.round(v.priceInNaira * 100), // convert to kobo
          compareAtPrice: v.compareAtPriceInNaira ? Math.round(v.compareAtPriceInNaira * 100) : null,
          stock: Number(v.stock),
          minOrderQty: Number(v.minOrderQty) || 1,
          sku: v.sku.trim().toUpperCase(),
        })),
      }

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product')
      }

      toast.success(editingProduct ? 'Product updated!' : 'Product created!')
      if (!editingProduct) {
        try {
          window.localStorage.removeItem(PRODUCT_DRAFT_KEY)
        } catch (error) {
          console.error('Unable to clear saved product draft:', error)
          toast.warning('The product was saved, but its local draft could not be cleared.')
        }
      }
      setModalOpen(false)
      fetchData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (p: ProductRecord) => {
    const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to delete')
    toast.success('Product deleted')
    fetchData()
  }

  const handleToggleStatus = async (p: ProductRecord, field: 'isActive' | 'isFeatured') => {
    try {
      const nextVal = !p[field]
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: nextVal }),
      })
      if (!res.ok) throw new Error('Update failed')
      toast.success(`${p.name} updated`)
      fetchData()
    } catch {
      toast.error('Failed to toggle status')
    }
  }

  const handleBulkVisibility = async (isActive: boolean) => {
    const selected = products.filter((product) => selectedProductIds.includes(product.id))
    if (selected.length === 0) return

    setBulkUpdating(true)
    const results = await Promise.allSettled(
      selected.map(async (product) => {
        const response = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.error || `Unable to update ${product.name}`)
        }
      })
    )
    const failures = results.filter((result) => result.status === 'rejected').length
    if (failures > 0) {
      toast.error(`${failures} of ${selected.length} products could not be updated.`)
    } else {
      toast.success(`${selected.length} products ${isActive ? 'published' : 'hidden'}.`)
    }
    setSelectedProductIds([])
    await fetchData()
    setBulkUpdating(false)
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.variants.some((v) => v.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const pageProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const visibleProductIds = pageProducts.map((product) => product.id)
  const allVisibleSelected =
    visibleProductIds.length > 0 && visibleProductIds.every((id) => selectedProductIds.includes(id))

  useEffect(() => {
    setCurrentPage(1)
    setSelectedProductIds([])
  }, [searchQuery])

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount)
  }, [currentPage, pageCount])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="text-brand-green" size={26} /> Foodstuffs &amp; Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage multi-variant pricing, warehouse stock, and agricultural commodities.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-brand-green/20"
        >
          <Plus size={16} /> Add Foodstuff
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by commodity name, category, or SKU..."
          className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {selectedProductIds.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-700" aria-live="polite">
            {selectedProductIds.length} product{selectedProductIds.length === 1 ? '' : 's'} selected
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void handleBulkVisibility(true)}
              disabled={bulkUpdating}
              className="rounded-lg bg-brand-green px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
            >
              Publish selected
            </button>
            <button
              type="button"
              onClick={() => void handleBulkVisibility(false)}
              disabled={bulkUpdating}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
            >
              Hide selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
            <RefreshCw size={16} className="animate-spin text-brand-green" /> Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() =>
                        setSelectedProductIds((selected) =>
                          allVisibleSelected
                            ? selected.filter((id) => !visibleProductIds.includes(id))
                            : Array.from(new Set([...selected, ...visibleProductIds]))
                        )
                      }
                      aria-label="Select all products on this page"
                    />
                  </th>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Variants &amp; Pricing</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6">Flags</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageProducts.map((p) => {
                  const lowestVariant = p.variants[0]
                  const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() =>
                            setSelectedProductIds((selected) =>
                              selected.includes(p.id)
                                ? selected.filter((id) => id !== p.id)
                                : [...selected, p.id]
                            )
                          }
                          aria-label={`Select ${p.name}`}
                        />
                      </td>
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {p.images[0] ? (
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {p.category.name}
                      </td>

                      {/* Variants & Starting Price */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-brand-green block">
                          From {formatPrice(lowestVariant?.price || 0)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.variants.length} {p.variants.length === 1 ? 'size' : 'sizes'} (
                          {p.variants.map((v) => v.unit).filter((v, i, a) => a.indexOf(v) === i).join(', ')})
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            totalStock > 20
                              ? 'bg-emerald-50 text-emerald-700'
                              : totalStock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Flags (Active & Featured) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(p, 'isActive')}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                              p.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                            title="Toggle public visibility"
                          >
                            {p.isActive ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(p, 'isFeatured')}
                            className={`p-1 rounded-full text-[10px] font-bold transition-colors ${
                              p.isFeatured
                                ? 'bg-brand-orange/20 text-brand-orange'
                                : 'text-slate-300 hover:text-slate-400'
                            }`}
                            title="Toggle featured showcase"
                          >
                            <Star size={14} fill={p.isFeatured ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-green hover:bg-slate-100 transition-colors"
                            title="Edit Commodity"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Commodity"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && filteredProducts.length > 0 && (
        <div className="flex items-center justify-between gap-4 text-xs text-slate-600">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span aria-live="polite">Page {currentPage} of {pageCount}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              disabled={currentPage >= pageCount}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-bold text-lg text-slate-900">
                {editingProduct ? 'Edit Foodstuff & Variants' : 'Register New Foodstuff'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            {!editingProduct && (
              <p aria-live="polite" className="mb-5 text-xs text-slate-500">
                {draftState === 'saving' && 'Saving draft…'}
                {draftState === 'saved' && 'Draft saved automatically on this device.'}
                {draftState === 'error' && 'Draft could not be saved in this browser.'}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Commodity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Premium Nigerian Rice"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Department
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Harvest origin, purity standards, preparation and export information..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Product Specifications (optional)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    ['origin', 'Origin'],
                    ['packaging', 'Packaging'],
                    ['shelfLife', 'Shelf life'],
                    ['storage', 'Storage'],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="block text-xs font-semibold text-slate-600">
                      {label}
                      <input
                        type="text"
                        maxLength={300}
                        value={specifications[field]}
                        onChange={(event) =>
                          setSpecifications((current) => ({ ...current, [field]: event.target.value }))
                        }
                        className="mt-1.5 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Multi-Image Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Commodity Images &amp; Photography
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden group"
                    >
                      <Image src={img} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-green text-slate-400 hover:text-brand-green flex flex-col items-center justify-center gap-1 transition-colors text-[10px] font-bold"
                  >
                    {uploadingImage ? (
                      <Loader2 size={16} className="animate-spin text-brand-green" />
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Variant Manager */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Measurement Variants &amp; Pricing
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Configure multiple bag sizes, kilograms, or litre drums for this foodstuff.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline"
                  >
                    <Plus size={14} /> Add Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-14 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          required
                          value={v.label}
                          onChange={(e) => handleVariantChange(i, 'label', e.target.value)}
                          placeholder="e.g. 50kg Bag"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Unit
                        </label>
                        <select
                          value={v.unit}
                          onChange={(e) => handleVariantChange(i, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="BAG">BAG</option>
                          <option value="KG">KG</option>
                          <option value="LITRE">LITRE</option>
                          <option value="CARTON">CARTON</option>
                          <option value="PIECE">PIECE</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Price (₦)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={v.priceInNaira}
                          onChange={(e) => handleVariantChange(i, 'priceInNaira', parseFloat(e.target.value) || 0)}
                          placeholder="52000"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-green"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Sale Price (₦)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={v.compareAtPriceInNaira || ''}
                          onChange={(e) => handleVariantChange(i, 'compareAtPriceInNaira', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="60000"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(i, 'stock', parseInt(e.target.value, 10) || 0)}
                          placeholder="50"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Min Qty
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={v.minOrderQty}
                          onChange={(e) => handleVariantChange(i, 'minOrderQty', parseInt(e.target.value, 10) || 1)}
                          placeholder="1"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-between gap-1 pt-3 sm:pt-0">
                        <div className="w-full">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1 truncate">
                            SKU
                          </label>
                          <input
                            type="text"
                            required
                            value={v.sku}
                            onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                            placeholder="RICE-50KG"
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-mono"
                          />
                        </div>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantRow(i)}
                            className="text-red-500 hover:text-red-700 p-1.5 mt-4"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-brand-green rounded border-slate-300 focus:ring-brand-green"
                  />
                  <span>Publish to Public Catalog (Active)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-brand-orange rounded border-slate-300 focus:ring-brand-orange"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-green/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Save Commodity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null)
        }}
        title="Delete product?"
        description={
          productToDelete
            ? `"${productToDelete.name}" will be permanently deleted. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete product"
        onConfirm={() => (productToDelete ? handleDelete(productToDelete) : undefined)}
      />
    </div>
  )
}
