'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Modal – centered on sm+, full-screen bottom-sheet on mobile.
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Confirm">
 *     …content…
 *   </Modal>
 */
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Focus trap + Escape key
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.focus()
    })
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const els = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = els[0]
      const last = els[els.length - 1]
      if (!first || !last) { e.preventDefault(); return }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
      prev?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-modal flex items-end sm:items-center justify-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      {/* Panel – bottom sheet on mobile, centered card on sm+ */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-xl sm:max-w-md p-6 animate-slide-up focus:outline-none',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/**
 * BottomSheet – slides up from the bottom on all screen sizes.
 * Has a drag handle and closes on Escape or backdrop tap.
 */
interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => sheetRef.current?.focus())
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
      prev?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-modal flex items-end" aria-modal="true" role="dialog" aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full bg-white rounded-t-2xl shadow-xl pb-[env(safe-area-inset-bottom)] animate-slide-up focus:outline-none',
          className
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
            <h2 className="text-base font-black text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className={cn('p-5', !title && 'pt-3')}>{children}</div>
      </div>
    </div>
  )
}
