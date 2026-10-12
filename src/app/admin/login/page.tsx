'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (res?.error) {
        setErrorMsg('Invalid admin credentials. Please verify your email and password.')
        toast.error('Authentication failed')
      } else {
        toast.success('Admin login successful! Redirecting...')
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setErrorMsg('A network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Admin Management Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to manage foodstuff commodities, inventory, and export orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'supaloveglobal@gmail.com'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-brand-green/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In to Console <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Admin Credentials Info */}
          <div className="mt-8 pt-5 border-t border-slate-100 bg-slate-50/70 p-3.5 rounded-2xl text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block mb-0.5">Admin Credentials:</span>
            <span>Email: <code className="font-bold text-slate-800">{process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'supaloveglobal@gmail.com'}</code></span>
            <br />
            <span>Password: Set in <code className="font-bold text-slate-800">.env</code> file</span>
          </div>
        </div>
      </div>
    </div>
  )
}
