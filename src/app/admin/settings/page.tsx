'use client'

import { useCallback, useEffect, useState } from 'react'
import { Save, Settings, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface DeliverySettings {
  deliveryFeeLagos: number
  deliveryFeeOther: number
  deliveryFeeDefault: number
}

const initialSettings: DeliverySettings = {
  deliveryFeeLagos: 150000,
  deliveryFeeOther: 350000,
  deliveryFeeDefault: 350000,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to load store settings')
      }
      setSettings(data.settings)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load store settings'
      setLoadError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  const updateFee = (field: keyof DeliverySettings, value: string) => {
    const naira = value === '' ? 0 : Number(value)
    setSettings((current) => ({
      ...current,
      [field]: Number.isFinite(naira) ? Math.round(naira * 100) : 0,
    }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to save delivery fees')
      }
      toast.success('Delivery settings saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save delivery fees')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
        <RefreshCw size={18} className="animate-spin text-brand-green" /> Loading store settings...
      </div>
    )
  }

  if (loadError) {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-semibold">Store settings could not be loaded.</p>
        <p className="mt-1">{loadError}</p>
        <button
          type="button"
          onClick={() => void loadSettings()}
          className="mt-4 rounded-lg border border-red-300 px-3 py-2 font-semibold hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    )
  }

  const fields: { key: keyof DeliverySettings; label: string; description: string }[] = [
    { key: 'deliveryFeeLagos', label: 'Lagos delivery fee', description: 'Applied to orders delivered within Lagos.' },
    { key: 'deliveryFeeOther', label: 'Other-state delivery fee', description: 'Applied outside Lagos when a state-specific setting is available.' },
    { key: 'deliveryFeeDefault', label: 'Fallback delivery fee', description: 'Used when the checkout cannot find a region-specific fee.' },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
          <Settings size={24} className="text-brand-green" /> Store Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage delivery pricing for Supalovefoods orders. Amounts are stored in kobo for checkout.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {fields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="block text-sm font-semibold text-slate-800">
              {field.label}
            </label>
            <p className="mt-1 text-xs text-slate-500">{field.description}</p>
            <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-brand-green/20">
              <span className="pl-3 text-sm text-slate-500" aria-hidden="true">₦</span>
              <input
                id={field.key}
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                required
                value={settings[field.key] / 100}
                onChange={(event) => updateFee(field.key, event.target.value)}
                className="w-full rounded-xl bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
