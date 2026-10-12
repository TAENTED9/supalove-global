'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Check,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

interface CategoryRecord {
  id: string
  name: string
  slug: string
  image: string | null
  _count?: { products: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [image, setImage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const openCreateModal = () => {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setImage('')
    setModalOpen(true)
  }

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setImage(cat.image || '')
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: slug.trim() || undefined, image: image.trim() || null }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category')
      }

      toast.success(editingCategory ? 'Category updated!' : 'Category created!')
      setModalOpen(false)
      fetchCategories()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (cat: CategoryRecord) => {
    if (!confirm(`Are you sure you want to delete "${cat.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category')
      }
      toast.success('Category deleted')
      fetchCategories()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error deleting category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="text-brand-green" size={26} /> Foodstuff Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize commodities into searchable agricultural departments.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-brand-green/20"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
            <RefreshCw size={16} className="animate-spin text-brand-green" /> Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No categories registered yet. Click &ldquo;Add Category&rdquo; above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-500">
                <tr>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Products</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">{c.slug}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold text-[11px]">
                        {c._count?.products ?? 0} commodities
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-green hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-bold text-base text-slate-900">
                {editingCategory ? 'Edit Category' : 'New Foodstuff Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grains & Cereals"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. grains-cereals (auto-generated if empty)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-green/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Save Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
